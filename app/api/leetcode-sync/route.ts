import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const LEETCODE_GRAPHQL = "https://leetcode.com/graphql"

const RECENT_SUBMISSIONS_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`

const USER_STATS_QUERY = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`

const PROBLEM_DETAIL_QUERY = `
  query problemDetail($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      title
      difficulty
      topicTags {
        name
      }
    }
  }
`

async function lcFetch(query: string, variables: Record<string, any>) {
  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://leetcode.com",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 0 },
  })

  if (!res.ok) throw new Error(`LeetCode API error: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

// GET /api/leetcode-sync?username=xxx — verify username + get stats
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")
  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 })

  try {
    const data = await lcFetch(USER_STATS_QUERY, { username })

    if (!data.matchedUser) {
      return NextResponse.json({ error: "LeetCode user not found" }, { status: 404 })
    }

    const stats = data.matchedUser.submitStats.acSubmissionNum
    const easy = stats.find((s: any) => s.difficulty === "Easy")?.count ?? 0
    const medium = stats.find((s: any) => s.difficulty === "Medium")?.count ?? 0
    const hard = stats.find((s: any) => s.difficulty === "Hard")?.count ?? 0

    return NextResponse.json({
      username: data.matchedUser.username,
      stats: { easy, medium, hard, total: easy + medium + hard },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/leetcode-sync — import recent submissions
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id

  const { username, limit = 20 } = await req.json()
  if (!username) return NextResponse.json({ error: "Username required" }, { status: 400 })

  try {
    // 1. Fetch recent accepted submissions
    const submissionsData = await lcFetch(RECENT_SUBMISSIONS_QUERY, { username, limit })
    const submissions: any[] = submissionsData.recentAcSubmissionList ?? []

    if (!submissions.length) {
      return NextResponse.json({ imported: 0, skipped: 0, message: "No recent submissions found" })
    }

    // 2. Get existing problem names to avoid duplicates
    const existing = await prisma.problem.findMany({
      where: { userId },
      select: { name: true },
    })
    const existingNames = new Set(existing.map((p) => p.name.toLowerCase()))

    // 3. Get all tags from DB
    const allTags = await prisma.tag.findMany()
    const tagMap = new Map(allTags.map((t) => [t.name.toLowerCase(), t.id]))

    // 4. For each new submission, fetch difficulty + tags
    let imported = 0
    let skipped = 0

    for (const sub of submissions) {
      if (existingNames.has(sub.title.toLowerCase())) {
        skipped++
        continue
      }

      try {
        // Fetch problem details for difficulty + tags
        const detail = await lcFetch(PROBLEM_DETAIL_QUERY, { titleSlug: sub.titleSlug })
        const question = detail.question

        if (!question) { skipped++; continue }

        const difficulty = question.difficulty as "Easy" | "Medium" | "Hard"
        const date = new Date(parseInt(sub.timestamp) * 1000)

        // Match LeetCode topic tags to our DB tags
        const matchedTagIds: string[] = []
        for (const topicTag of question.topicTags ?? []) {
          const normalized = topicTag.name.toLowerCase()
          // Try exact match first, then partial
          const tagId = tagMap.get(normalized) ??
            [...tagMap.entries()].find(([k]) => k.includes(normalized) || normalized.includes(k))?.[1]
          if (tagId) matchedTagIds.push(tagId)
        }

        await prisma.problem.create({
          data: {
            userId,
            name: question.title,
            url: `https://leetcode.com/problems/${sub.titleSlug}/`,
            difficulty,
            date,
            solved: "Yes",
            tags: {
              create: [...new Set(matchedTagIds)].map((tagId) => ({ tagId })),
            },
          },
        })

        existingNames.add(sub.title.toLowerCase())
        imported++

        // Small delay to avoid hammering LeetCode
        await new Promise((r) => setTimeout(r, 300))
      } catch {
        skipped++
      }
    }

    return NextResponse.json({
      imported,
      skipped,
      message: `Imported ${imported} problems, skipped ${skipped} duplicates`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

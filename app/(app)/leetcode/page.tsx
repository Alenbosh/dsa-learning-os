import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProblemsClient } from "@/components/leetcode/ProblemsClient"

export default async function LeetCodePage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const [problems, tags] = await Promise.all([
    prisma.problem.findMany({
      where: { userId },
      select: {
        id: true,
        userId: true,
        name: true,
        url: true,
        difficulty: true,
        date: true,
        timeTaken: true,
        attempts: true,
        solved: true,
        confidence: true,
        rating: true,
        pattern: true,
        mistake: true,
        isContest: true,
        revisit: true,
        createdAt: true,
        updatedAt: true,
        tags: { select: { tag: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tag.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ])

  return <ProblemsClient initialProblems={problems as any} tags={tags} />
}

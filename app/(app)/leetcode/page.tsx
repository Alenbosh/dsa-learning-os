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
      include: { tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ])

  return <ProblemsClient initialProblems={problems as any} tags={tags} />
}

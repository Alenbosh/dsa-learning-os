import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ProblemDetail } from "@/components/leetcode/ProblemDetail"

export default async function ProblemPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const problem = await prisma.problem.findFirst({
    where: { id: params.id, userId },
    include: {
      tags: { include: { tag: true } },
      topicLinks: { include: { topic: true } },
    },
  })

  if (!problem) notFound()

  return <ProblemDetail problem={problem as any} />
}

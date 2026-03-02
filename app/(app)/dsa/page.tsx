import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DsaBoardClient } from "@/components/dsa/DsaBoardClient"

export default async function DsaPage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const topics = await prisma.dsaTopic.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      status: true,
      confidence: true,
      lastReviewed: true,
      order: true,
      problems: { select: { problemId: true } },
    },
    orderBy: { order: "asc" },
  })

  return <DsaBoardClient initialTopics={topics as any} />
}

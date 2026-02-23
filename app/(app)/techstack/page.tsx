import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { TechStackClient } from "@/components/techstack/TechStackClient"

export default async function TechStackPage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const techStack = await prisma.techStack.findMany({
    where: { userId },
    include: { resources: true, projects: true },
    orderBy: { order: "asc" },
  })

  return <TechStackClient initialStack={techStack as any} />
}

import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id

  const { resources, projects, ...data } = await req.json()

  const tech = await prisma.techStack.create({
    data: {
      ...data,
      userId,
      resources: { create: resources ?? [] },
      projects: { create: projects ?? [] },
    },
    include: { resources: true, projects: true },
  })
  return NextResponse.json(tech, { status: 201 })
}

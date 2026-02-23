import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id

  const topics = await prisma.dsaTopic.findMany({
    where: { userId },
    include: { problems: { include: { problem: true } }, resources: true },
    orderBy: { order: "asc" },
  })
  return NextResponse.json(topics)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = (session.user as any).id

  const body = await req.json()
  const topic = await prisma.dsaTopic.create({
    data: { ...body, userId },
    include: { problems: true, resources: true },
  })
  return NextResponse.json(topic, { status: 201 })
}

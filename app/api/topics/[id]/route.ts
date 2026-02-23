import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getUserId() {
  const session = await getServerSession(authOptions)
  if (!session) return null
  return (session.user as any).id as string
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const topic = await prisma.dsaTopic.update({
    where: { id: params.id },
    data: { ...body, lastReviewed: body.status === "NeedsRevision" ? new Date() : undefined },
    include: { problems: { include: { problem: true } }, resources: true },
  })
  return NextResponse.json(topic)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.dsaTopic.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

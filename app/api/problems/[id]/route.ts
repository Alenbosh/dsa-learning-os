import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function getUserId() {
  const session = await getServerSession(authOptions)
  if (!session) return null
  return (session.user as any).id as string
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const problem = await prisma.problem.findFirst({
    where: { id: params.id, userId },
    include: { tags: { include: { tag: true } }, topicLinks: { include: { topic: true } } },
  })
  if (!problem) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(problem)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { tagIds, ...data } = body

  // Only update tags if tagIds was explicitly included
  const tagsUpdate =
    tagIds !== undefined
      ? {
          tags: {
            deleteMany: {},
            create: tagIds.map((tagId: string) => ({ tagId })),
          },
        }
      : {}

  const problem = await prisma.problem.update({
    where: { id: params.id },
    data: { ...data, ...tagsUpdate },
    include: { tags: { include: { tag: true } } },
  })

  return NextResponse.json(problem)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.problem.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

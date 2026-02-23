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

  const { resources, projects, ...data } = await req.json()

  const tech = await prisma.techStack.update({
    where: { id: params.id },
    data: {
      ...data,
      ...(resources !== undefined && {
        resources: {
          deleteMany: {},
          create: resources,
        },
      }),
    },
    include: { resources: true, projects: true },
  })
  return NextResponse.json(tech)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await prisma.techStack.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const problems = await prisma.problem.findMany({
    where: { userId },
    include: {
      tags: { include: { tag: true } },
      topicLinks: { select: { topicId: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(problems);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const body = await req.json();
  const { tagIds, topicIds, ...data } = body;

  const problem = await prisma.problem.create({
    data: {
      ...data,
      userId,
      tags: { create: (tagIds ?? []).map((tagId: string) => ({ tagId })) },
      topicLinks: {
        create: (topicIds ?? []).map((topicId: string) => ({ topicId })),
      },
    },
    include: {
      tags: { include: { tag: true } },
      topicLinks: { select: { topicId: true } },
    },
  });

  return NextResponse.json(problem, { status: 201 });
}

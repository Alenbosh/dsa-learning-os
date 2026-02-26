import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      leetcodeUsername: true,
    },
  });
  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const body = await req.json();
  const { leetcodeUsername } = body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { leetcodeUsername: leetcodeUsername ?? null },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      leetcodeUsername: true,
    },
  });
  return NextResponse.json(user);
}

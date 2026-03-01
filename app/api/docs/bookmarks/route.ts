import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const bookmarks = await prisma.docBookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookmarks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const body = await req.json();
  const { name, url, description, category } = body;

  if (!name || !url) {
    return NextResponse.json(
      { error: "name and url are required" },
      { status: 400 },
    );
  }

  // upsert — safe to call even if already bookmarked
  const bookmark = await prisma.docBookmark.upsert({
    where: { userId_url: { userId, url } },
    update: {
      name,
      description: description ?? null,
      category: category ?? null,
    },
    create: {
      userId,
      name,
      url,
      description: description ?? null,
      category: category ?? null,
    },
  });

  return NextResponse.json(bookmark, { status: 201 });
}

import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  // Verify ownership before delete
  const bookmark = await prisma.docBookmark.findFirst({
    where: { id: params.id, userId },
  });

  if (!bookmark) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.docBookmark.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

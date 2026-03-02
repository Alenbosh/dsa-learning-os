import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * DELETE /api/auth/link-provider?provider=github
 *
 * Unlinks a provider from the current user's account.
 * Safety: refuses if it's the user's only linked provider
 * (would lock them out of their account).
 */
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const provider = searchParams.get("provider");

  if (!provider) {
    return NextResponse.json(
      { error: "provider param required" },
      { status: 400 },
    );
  }

  // Count how many providers this user currently has
  const allAccounts = await prisma.account.findMany({
    where: { userId },
    select: { id: true, provider: true },
  });

  if (allAccounts.length <= 1) {
    return NextResponse.json(
      {
        error:
          "Cannot unlink your only sign-in method. You would be locked out.",
      },
      { status: 400 },
    );
  }

  const target = allAccounts.find((a) => a.provider === provider);
  if (!target) {
    return NextResponse.json({ error: "Provider not linked" }, { status: 404 });
  }

  await prisma.account.delete({ where: { id: target.id } });

  return NextResponse.json({ success: true, provider });
}

/**
 * GET /api/auth/link-provider
 *
 * Returns the list of providers currently linked to the user.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { provider: true },
    orderBy: { provider: "asc" },
  });

  return NextResponse.json(accounts);
}

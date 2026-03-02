import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface SearchResult {
  id: string;
  type: "problem" | "topic" | "tech" | "bookmark";
  label: string;
  sublabel?: string; // difficulty, status, stage, category
  href: string; // where to redirect on the site
  externalUrl?: string; // for bookmarks — the actual docs URL
  badge?: string; // e.g. "Easy", "Hard", "InProgress"
  badgeColor?: string; // tailwind text color
}

function diffColor(d: string): string {
  if (d === "Easy") return "text-emerald-400";
  if (d === "Medium") return "text-amber-400";
  if (d === "Hard") return "text-rose-400";
  return "text-zinc-400";
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    NotStarted: "Not Started",
    InProgress: "In Progress",
    NeedsRevision: "Needs Revision",
    Done: "Done",
  };
  return map[s] ?? s;
}

function stageLabel(s: string): string {
  const map: Record<string, string> = {
    WantToLearn: "Want to Learn",
    CurrentlyLearning: "Learning",
    BuildingWith: "Building",
    Comfortable: "Comfortable",
  };
  return map[s] ?? s;
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q || q.length < 1) return NextResponse.json([]);

  // Run all three DB queries in parallel
  const [problems, topics, techStack, bookmarks] = await Promise.all([
    prisma.problem.findMany({
      where: {
        userId,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { pattern: { contains: q, mode: "insensitive" } },
          {
            tags: {
              some: { tag: { name: { contains: q, mode: "insensitive" } } },
            },
          },
        ],
      },
      select: { id: true, name: true, difficulty: true, url: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.dsaTopic.findMany({
      where: {
        userId,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { notes: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, status: true },
      take: 5,
      orderBy: { order: "asc" },
    }),
    prisma.techStack.findMany({
      where: {
        userId,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
          { notes: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, stage: true, category: true },
      take: 4,
      orderBy: { order: "asc" },
    }),
    prisma.docBookmark.findMany({
      where: {
        userId,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { category: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        url: true,
        description: true,
        category: true,
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const results: SearchResult[] = [
    // Problems → redirect to /leetcode page (problem detail)
    ...problems.map((p) => ({
      id: `problem-${p.id}`,
      type: "problem" as const,
      label: p.name,
      sublabel: p.difficulty,
      href: `/leetcode/${p.id}`,
      badge: p.difficulty,
      badgeColor: diffColor(p.difficulty),
    })),

    // DSA Topics → redirect to /dsa
    ...topics.map((t) => ({
      id: `topic-${t.id}`,
      type: "topic" as const,
      label: t.name,
      sublabel: statusLabel(t.status),
      href: `/dsa`,
      badge: statusLabel(t.status),
      badgeColor:
        t.status === "Done"
          ? "text-emerald-400"
          : t.status === "InProgress"
            ? "text-blue-400"
            : t.status === "NeedsRevision"
              ? "text-amber-400"
              : "text-zinc-500",
    })),

    // Tech Stack → redirect to /techstack
    ...techStack.map((t) => ({
      id: `tech-${t.id}`,
      type: "tech" as const,
      label: t.name,
      sublabel: t.category ?? stageLabel(t.stage),
      href: `/techstack`,
      badge: stageLabel(t.stage),
      badgeColor:
        t.stage === "Comfortable"
          ? "text-emerald-400"
          : t.stage === "CurrentlyLearning"
            ? "text-orange-400"
            : t.stage === "BuildingWith"
              ? "text-blue-400"
              : "text-zinc-500",
    })),

    // Starred bookmarks → open the external docs URL
    ...bookmarks.map((b) => ({
      id: `bookmark-${b.id}`,
      type: "bookmark" as const,
      label: b.name,
      sublabel: b.description ?? b.category ?? "",
      href: `/docs`,
      externalUrl: b.url,
      badge: b.category ?? "Docs",
      badgeColor: "text-violet-400",
    })),
  ];

  return NextResponse.json(results);
}

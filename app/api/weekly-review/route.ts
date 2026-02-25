import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  startOfWeek,
  endOfWeek,
  subWeeks,
  eachDayOfInterval,
  format,
} from "date-fns";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const url = new URL(req.url);
  const weeksBack = parseInt(url.searchParams.get("week") ?? "0");

  const refDate = subWeeks(new Date(), weeksBack);
  const weekStart = startOfWeek(refDate, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(refDate, { weekStartsOn: 1 });

  const [problems, reviewSessions, topicsUpdated] = await Promise.all([
    prisma.problem.findMany({
      where: { userId, date: { gte: weekStart, lte: weekEnd } },
      include: {
        tags: { include: { tag: true } },
        topicLinks: { select: { topicId: true } },
      },
      orderBy: { date: "asc" },
    }),
    prisma.reviewSession.findMany({
      where: { userId, reviewedAt: { gte: weekStart, lte: weekEnd } },
      include: { topic: { select: { id: true, name: true } } },
      orderBy: { reviewedAt: "asc" },
    }),
    prisma.dsaTopic.findMany({
      where: { userId, lastReviewed: { gte: weekStart, lte: weekEnd } },
    }),
  ]);

  // Build day-by-day breakdown
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd }).map(
    (day) => {
      const dayStr = format(day, "yyyy-MM-dd");
      const dayProblems = problems.filter(
        (p) => p.date && format(new Date(p.date), "yyyy-MM-dd") === dayStr,
      );
      const dayReviews = reviewSessions.filter(
        (r) => format(new Date(r.reviewedAt), "yyyy-MM-dd") === dayStr,
      );
      return {
        date: dayStr,
        label: format(day, "EEE"),
        problemsSolved: dayProblems.length,
        reviewsDone: dayReviews.length,
        easy: dayProblems.filter((p) => p.difficulty === "Easy").length,
        medium: dayProblems.filter((p) => p.difficulty === "Medium").length,
        hard: dayProblems.filter((p) => p.difficulty === "Hard").length,
      };
    },
  );

  // Topic breakdown for the week
  const topicMap: Record<
    string,
    { name: string; problems: number; reviews: number; avgRating: number }
  > = {};
  problems.forEach((p) => {
    p.topicLinks.forEach(({ topicId }) => {
      if (!topicMap[topicId])
        topicMap[topicId] = {
          name: topicId,
          problems: 0,
          reviews: 0,
          avgRating: 0,
        };
      topicMap[topicId].problems++;
    });
  });
  const ratingSum: Record<string, number[]> = {};
  reviewSessions.forEach((r) => {
    const id = r.topic.id;
    if (!topicMap[id])
      topicMap[id] = {
        name: r.topic.name,
        problems: 0,
        reviews: 0,
        avgRating: 0,
      };
    else topicMap[id].name = r.topic.name;
    topicMap[id].reviews++;
    if (!ratingSum[id]) ratingSum[id] = [];
    ratingSum[id].push(r.rating);
  });
  Object.keys(ratingSum).forEach((id) => {
    topicMap[id].avgRating =
      ratingSum[id].reduce((a, b) => a + b, 0) / ratingSum[id].length;
  });

  return NextResponse.json({
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    weeksBack,
    summary: {
      totalProblems: problems.length,
      easy: problems.filter((p) => p.difficulty === "Easy").length,
      medium: problems.filter((p) => p.difficulty === "Medium").length,
      hard: problems.filter((p) => p.difficulty === "Hard").length,
      totalReviews: reviewSessions.length,
      topicsReviewed: topicsUpdated.length,
      avgConfidence: reviewSessions.length
        ? reviewSessions.reduce((a, r) => a + r.rating, 0) /
          reviewSessions.length
        : null,
    },
    days,
    topics: Object.values(topicMap),
    problems: problems.slice(0, 20), // recent 20
  });
}

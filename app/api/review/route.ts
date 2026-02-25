import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// SM-2 algorithm
function sm2(
  easiness: number,
  repetition: number,
  interval: number,
  quality: number,
) {
  // quality: 0-5 (0-2 = fail, 3-5 = pass)
  let newEasiness = Math.max(
    1.3,
    easiness + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
  );
  let newRepetition = quality < 3 ? 0 : repetition + 1;
  let newInterval: number;
  if (quality < 3) {
    newInterval = 1;
  } else if (newRepetition === 1) {
    newInterval = 1;
  } else if (newRepetition === 2) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * newEasiness);
  }
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);
  return { newEasiness, newRepetition, newInterval, nextReview };
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const { topicId, quality } = await req.json(); // quality: 0-5
  if (quality === undefined || !topicId) {
    return NextResponse.json(
      { error: "topicId and quality required" },
      { status: 400 },
    );
  }

  const topic = await prisma.dsaTopic.findFirst({
    where: { id: topicId, userId },
  });
  if (!topic) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { newEasiness, newRepetition, newInterval, nextReview } = sm2(
    topic.sm2Easiness,
    topic.sm2Repetition,
    topic.sm2Interval,
    quality,
  );

  const [updatedTopic] = await prisma.$transaction([
    prisma.dsaTopic.update({
      where: { id: topicId },
      data: {
        sm2Easiness: newEasiness,
        sm2Repetition: newRepetition,
        sm2Interval: newInterval,
        sm2NextReview: nextReview,
        lastReviewed: new Date(),
        confidence:
          quality >= 4
            ? Math.min(5, (topic.confidence ?? 0) + 1)
            : topic.confidence,
      },
      include: { problems: { include: { problem: true } }, resources: true },
    }),
    prisma.reviewSession.create({
      data: {
        userId,
        topicId,
        rating: quality,
        interval: newInterval,
        easiness: newEasiness,
      },
    }),
  ]);

  return NextResponse.json({
    topic: updatedTopic,
    nextReview,
    interval: newInterval,
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;

  const now = new Date();
  const dueTopics = await prisma.dsaTopic.findMany({
    where: {
      userId,
      OR: [
        { sm2NextReview: { lte: now } },
        { sm2NextReview: null, sm2Repetition: 0 },
      ],
    },
    include: { problems: { include: { problem: true } }, resources: true },
    orderBy: { sm2NextReview: "asc" },
  });

  return NextResponse.json(dueTopics);
}

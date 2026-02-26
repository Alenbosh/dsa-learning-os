import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StatsCard } from "@/components/shared/StatsCard"
import { SolveHeatmap } from "@/components/leetcode/SolveHeatmap"
import { RevisionQueue } from "@/components/dsa/RevisionQueue"
import { SpacedRepetitionQueue } from "@/components/dsa/SpacedRepetitionQueue"
import { calculateStreak } from "@/lib/utils"
import {
    Code2, Brain, Layers, Flame,
    AlertCircle, TrendingUp, BookOpen, Zap, CalendarDays
} from "lucide-react"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    const userId = (session!.user as any).id

    const now = new Date()

    const [problems, topics, techStack] = await Promise.all([
        prisma.problem.findMany({
            where: { userId },
            include: { tags: { include: { tag: true } } },
            orderBy: { createdAt: "desc" },
        }),
        prisma.dsaTopic.findMany({ where: { userId } }),
        prisma.techStack.findMany({ where: { userId } }),
    ])

    const streak = calculateStreak(problems as any)

    const dueForReview = topics.filter(
        (t) => !t.sm2NextReview || t.sm2NextReview <= now
    ).length

    const stats = {
        total: problems.length,
        easy: problems.filter((p) => p.difficulty === "Easy").length,
        medium: problems.filter((p) => p.difficulty === "Medium").length,
        hard: problems.filter((p) => p.difficulty === "Hard").length,
        revisit: problems.filter((p) => p.revisit).length,
        topicsInProgress: topics.filter((t) => t.status === "InProgress").length,
        topicsRevision: topics.filter((t) => t.status === "NeedsRevision").length,
        techLearning: techStack.filter((t) => t.stage === "CurrentlyLearning").length,
    }

    const revisionProblems = problems
        .filter((p) => p.revisit)
        .slice(0, 5) as any

    return (
        <div className="space-y-8 max-w-6xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Good {getGreeting()}, {session!.user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-zinc-600 dark:text-zinc-500 text-sm mt-1">Here's your learning progress</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsCard
                    label="Total Solved"
                    value={stats.total}
                    icon={<Code2 size={16} />}
                    sub={`${stats.easy}E · ${stats.medium}M · ${stats.hard}H`}
                    color="orange"
                />
                <StatsCard
                    label="Current Streak"
                    value={`${streak}d`}
                    icon={<Flame size={16} />}
                    sub={streak > 0 ? "Keep it going!" : "Start today!"}
                    color={streak >= 7 ? "green" : streak > 0 ? "orange" : "zinc"}
                />
                <StatsCard
                    label="Due for Review"
                    value={dueForReview}
                    icon={<Zap size={16} />}
                    sub="spaced repetition"
                    color={dueForReview > 0 ? "amber" : "zinc"}
                    href="/dsa"
                />
                <StatsCard
                    label="DSA in Progress"
                    value={stats.topicsInProgress}
                    icon={<Brain size={16} />}
                    sub={`${stats.topicsRevision} need revision`}
                    color="blue"
                    href="/dsa"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Heatmap */}
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp size={15} className="text-orange-400" />
                        <span className="text-sm font-semibold">Solve Activity</span>
                    </div>
                    <SolveHeatmap problems={problems as any} />
                </div>

                {/* Revision Queue */}
                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen size={15} className="text-amber-400" />
                        <span className="text-sm font-semibold">Revision Queue</span>
                    </div>
                    <RevisionQueue problems={revisionProblems} />
                </div>
            </div>

            {/* Spaced Repetition + Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SM-2 Review */}
                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Zap size={15} className="text-purple-400" />
                            <span className="text-sm font-semibold">Spaced Repetition</span>
                        </div>
                        {dueForReview > 0 && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                                {dueForReview} due
                            </span>
                        )}
                    </div>
                    <SpacedRepetitionQueue />
                </div>

                {/* Quick Links */}
                <div className="space-y-3">
                    <QuickLink href="/leetcode" icon={<Code2 size={18} className="text-orange-400" />} title="LeetCode Tracker" desc={`${stats.total} problems logged`} />
                    <QuickLink href="/dsa" icon={<Brain size={18} className="text-blue-400" />} title="DSA Study Board" desc={`${stats.topicsInProgress} topics in progress`} />
                    <QuickLink href="/review" icon={<CalendarDays size={18} className="text-emerald-400" />} title="Weekly Review" desc="See your progress by week" />
                    <QuickLink href="/techstack" icon={<Layers size={18} className="text-purple-400" />} title="Tech Stack" desc={`${stats.techLearning} currently learning`} />
                </div>
            </div>
        </div>
    )
}

function QuickLink({ href, icon, title, desc }: {
    href: string; icon: React.ReactNode; title: string; desc: string
}) {
    return (
        <a href={href} className="group flex items-center gap-4 p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-150">
            <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">{icon}</div>
            <div>
                <div className="font-semibold text-sm">{title}</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-500">{desc}</div>
            </div>
        </a>
    )
}

function getGreeting() {
    const h = new Date().getHours()
    if (h < 12) return "morning"
    if (h < 17) return "afternoon"
    return "evening"
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Loader2, Code2, Brain, BarChart2, CalendarDays, Trophy, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"

const DIFF_COLORS = {
    Easy: "bg-emerald-400",
    Medium: "bg-amber-400",
    Hard: "bg-rose-400",
}

export function WeeklyReviewClient({ user }: { user: any }) {
    const [weeksBack, setWeeksBack] = useState(0)
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const load = useCallback((week: number) => {
        setLoading(true)
        fetch(`/api/weekly-review?week=${week}`)
            .then((r) => r.json())
            .then((d) => { setData(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    useEffect(() => { load(weeksBack) }, [weeksBack, load])

    const maxProblems = data ? Math.max(...data.days.map((d: any) => d.problemsSolved), 1) : 1

    const weekLabel = weeksBack === 0
        ? "This Week"
        : weeksBack === 1
            ? "Last Week"
            : `${weeksBack} Weeks Ago`

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold">Weekly Review</h1>
                    <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-0.5">Your learning summary by week</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setWeeksBack((w) => w + 1)}
                        className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400">
                        <ChevronLeft size={14} />
                    </button>
                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 w-28 text-center">{weekLabel}</span>
                    <button onClick={() => setWeeksBack((w) => Math.max(0, w - 1))} disabled={weeksBack === 0}
                        className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400 disabled:opacity-30">
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48 text-zinc-600 dark:text-zinc-600">
                    <Loader2 size={18} className="animate-spin mr-2" /> Loading weekly data…
                </div>
            ) : !data ? null : (
                <>
                    {/* Date range */}
                    <p className="text-xs text-zinc-600 dark:text-zinc-600">
                        {format(parseISO(data.weekStart), "MMM d")} – {format(parseISO(data.weekEnd), "MMM d, yyyy")}
                    </p>

                    {/* Summary stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <StatBox icon={<Code2 size={14} className="text-orange-400" />} label="Problems Solved" value={data.summary.totalProblems}
                            sub={`${data.summary.easy}E · ${data.summary.medium}M · ${data.summary.hard}H`} />
                        <StatBox icon={<Brain size={14} className="text-blue-400" />} label="Topics Reviewed" value={data.summary.topicsReviewed}
                            sub={`${data.summary.totalReviews} review sessions`} />
                        <StatBox icon={<BarChart2 size={14} className="text-purple-400" />} label="Avg SM-2 Rating"
                            value={data.summary.avgConfidence != null ? data.summary.avgConfidence.toFixed(1) : "—"}
                            sub="out of 5.0" />
                        <StatBox icon={<TrendingUp size={14} className="text-emerald-400" />} label="Active Days"
                            value={data.days.filter((d: any) => d.problemsSolved > 0 || d.reviewsDone > 0).length}
                            sub="out of 7" />
                    </div>

                    {/* Day chart */}
                    <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-5">
                            <CalendarDays size={14} className="text-orange-400" />
                            <span className="text-sm font-semibold">Daily Breakdown</span>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {data.days.map((day: any) => (
                                <div key={day.date} className="flex flex-col items-center gap-1.5">
                                    {/* Bar */}
                                    <div className="relative w-full flex flex-col justify-end" style={{ height: 80 }}>
                                        {day.problemsSolved > 0 && (
                                            <div className="w-full rounded-t"
                                                style={{ height: `${Math.max(8, (day.problemsSolved / maxProblems) * 80)}px`, background: "rgb(249 115 22 / 0.7)" }} />
                                        )}
                                        {day.problemsSolved === 0 && (
                                            <div className="w-full rounded-t bg-zinc-200 dark:bg-zinc-800" style={{ height: 6 }} />
                                        )}
                                    </div>
                                    {/* Label */}
                                    <span className="text-[10px] text-zinc-600 dark:text-zinc-600 font-medium">{day.label}</span>
                                    <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-400">{day.problemsSolved}</span>
                                    {day.reviewsDone > 0 && (
                                        <span className="text-[9px] text-blue-500">{day.reviewsDone}r</span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                            <Legend color="bg-orange-500/70" label="Problems solved" />
                            <Legend color="bg-blue-500/70" label="Review sessions (r)" />
                        </div>
                    </div>

                    {/* Topic breakdown */}
                    {data.topics.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Brain size={14} className="text-blue-400" />
                                <span className="text-sm font-semibold">Topics This Week</span>
                            </div>
                            <div className="space-y-2">
                                {data.topics.sort((a: any, b: any) => b.problems - a.problems).map((topic: any) => (
                                    <div key={topic.name} className="flex items-center gap-3">
                                        <span className="text-xs text-zinc-600 dark:text-zinc-400 w-40 truncate">{topic.name}</span>
                                        <div className="flex items-center gap-2 flex-1">
                                            {topic.problems > 0 && (
                                                <span className="text-[10px] px-1.5 py-0.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded font-mono">
                                                    {topic.problems}p
                                                </span>
                                            )}
                                            {topic.reviews > 0 && (
                                                <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-mono">
                                                    {topic.reviews}r
                                                </span>
                                            )}
                                            {topic.avgRating > 0 && (
                                                <span className="text-[10px] text-zinc-600 dark:text-zinc-600">avg {topic.avgRating.toFixed(1)}/5</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent problems */}
                    {data.problems.length > 0 && (
                        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Code2 size={14} className="text-orange-400" />
                                <span className="text-sm font-semibold">Problems This Week</span>
                            </div>
                            <div className="space-y-1.5">
                                {data.problems.map((p: any) => (
                                    <div key={p.id} className="flex items-center gap-3 py-1.5">
                                        <span className={cn("w-2 h-2 rounded-full shrink-0", DIFF_COLORS[p.difficulty as keyof typeof DIFF_COLORS])} />
                                        {p.url ? (
                                            <a href={p.url} target="_blank" rel="noopener noreferrer"
                                                className="text-xs text-zinc-700 dark:text-zinc-300 hover:text-orange-400 transition-colors flex-1 truncate">
                                                {p.name}
                                            </a>
                                        ) : (
                                            <span className="text-xs text-zinc-600 dark:text-zinc-400 flex-1 truncate">{p.name}</span>
                                        )}
                                        <span className="text-[10px] text-zinc-600 dark:text-zinc-600 shrink-0">
                                            {p.date ? format(new Date(p.date), "EEE") : ""}
                                        </span>
                                        {p.pattern && (
                                            <span className="text-[10px] text-zinc-600 dark:text-zinc-600 hidden md:block max-w-[120px] truncate">{p.pattern}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.summary.totalProblems === 0 && data.summary.topicsReviewed === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-zinc-600 dark:text-zinc-700 gap-2">
                            <Trophy size={28} />
                            <span className="text-sm">No activity logged this week.</span>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function StatBox({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: any; sub?: string }) {
    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">{icon}<span className="text-[11px] text-zinc-600 dark:text-zinc-500 font-medium uppercase tracking-wide">{label}</span></div>
            <div className="text-2xl font-bold">{value}</div>
            {sub && <div className="text-[10px] text-zinc-600 dark:text-zinc-600 mt-0.5">{sub}</div>}
        </div>
    )
}

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={cn("w-2.5 h-2.5 rounded-sm", color)} />
            <span className="text-[10px] text-zinc-600 dark:text-zinc-600">{label}</span>
        </div>
    )
}

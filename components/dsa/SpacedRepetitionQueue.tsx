"use client"

import { useState, useEffect } from "react"
import { Brain, ChevronRight, Loader2, CheckCircle2, Clock, Repeat2 } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const QUALITY_LABELS = [
    { value: 0, label: "Blackout", color: "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20" },
    { value: 1, label: "Wrong", color: "bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20" },
    { value: 2, label: "Hard", color: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20" },
    { value: 3, label: "Okay", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20" },
    { value: 4, label: "Good", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20" },
    { value: 5, label: "Perfect", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25" },
]

export function SpacedRepetitionQueue({ onTopicUpdated }: { onTopicUpdated?: (t: any) => void }) {
    const [dueTopics, setDueTopics] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentIdx, setCurrentIdx] = useState(0)
    const [revealed, setRevealed] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [sessionDone, setSessionDone] = useState(false)

    useEffect(() => {
        fetch("/api/review")
            .then((r) => r.json())
            .then((data) => { setDueTopics(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    const current = dueTopics[currentIdx]
    const total = dueTopics.length
    const progress = total > 0 ? (currentIdx / total) * 100 : 0

    async function handleRate(quality: number) {
        if (!current || submitting) return
        setSubmitting(true)
        try {
            const res = await fetch("/api/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topicId: current.id, quality }),
            })
            if (!res.ok) throw new Error()
            const { topic, nextReview, interval } = await res.json()
            onTopicUpdated?.(topic)

            const intervalLabel = interval === 1 ? "tomorrow" : `in ${interval} days`
            toast.success(`Next review ${intervalLabel}`, { icon: quality >= 3 ? "✅" : "🔁" })

            if (currentIdx + 1 >= total) setSessionDone(true)
            else { setCurrentIdx((i) => i + 1); setRevealed(false) }
        } catch {
            toast.error("Failed to save review")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-32 text-zinc-600 dark:text-zinc-600">
                <Loader2 size={18} className="animate-spin mr-2" /> Loading due reviews…
            </div>
        )
    }

    if (total === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-32 gap-2 text-zinc-600 dark:text-zinc-600">
                <CheckCircle2 size={22} className="text-emerald-500" />
                <span className="text-sm">All caught up! No reviews due.</span>
            </div>
        )
    }

    if (sessionDone) {
        return (
            <div className="flex flex-col items-center justify-center h-32 gap-2 text-zinc-600 dark:text-zinc-500">
                <CheckCircle2 size={22} className="text-emerald-500" />
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Session complete! {total} topics reviewed.</span>
                <button onClick={() => { setCurrentIdx(0); setSessionDone(false); setRevealed(false) }}
                    className="text-xs text-orange-400 hover:text-orange-300 mt-1">Review again</button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-500 mb-1">
                <span>{currentIdx + 1} of {total} due</span>
                <span className="flex items-center gap-1"><Clock size={10} /> today</span>
            </div>
            <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>

            {/* Card */}
            <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm">{current.name}</h3>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-mono shrink-0",
                        current.sm2Repetition === 0 ? "text-zinc-600 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700" : "text-blue-400 bg-blue-400/10 border-blue-400/20"
                    )}>
                        {current.sm2Repetition === 0 ? "New" : `Rep ${current.sm2Repetition}`}
                    </span>
                </div>

                {current.notes && (
                    <p className={cn("text-xs text-zinc-600 dark:text-zinc-500 transition-all", revealed ? "opacity-100" : "opacity-0 select-none blur-sm")}>
                        {current.notes}
                    </p>
                )}

                {current.problems?.length > 0 && revealed && (
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-600">Linked Problems</p>
                        <div className="flex flex-wrap gap-1.5">
                            {current.problems.slice(0, 4).map(({ problem }: any) => (
                                <span key={problem.id} className="text-[11px] px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 rounded font-mono">
                                    {problem.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {!revealed ? (
                    <button onClick={() => setRevealed(true)}
                        className="w-full py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all">
                        Show notes & rate →
                    </button>
                ) : (
                    <div className="space-y-2 pt-1">
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-600">How well did you recall this?</p>
                        <div className="grid grid-cols-3 gap-1.5">
                            {QUALITY_LABELS.map(({ value, label, color }) => (
                                <button key={value} onClick={() => handleRate(value)} disabled={submitting}
                                    className={cn("py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-40", color)}>
                                    {submitting ? <Loader2 size={11} className="animate-spin mx-auto" /> : label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

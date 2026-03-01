"use client"

import CalendarHeatmap from "react-calendar-heatmap"
import { Tooltip } from "react-tooltip"
import { format, subYears } from "date-fns"
import type { ProblemWithTags } from "@/types"
import "react-calendar-heatmap/dist/styles.css"

export function SolveHeatmap({ problems }: { problems: ProblemWithTags[] }) {
    const counts: Record<string, number> = {}
    problems.forEach((p) => {
        if (!p.date) return
        const key = format(new Date(p.date), "yyyy-MM-dd")
        counts[key] = (counts[key] || 0) + 1
    })

    const values = Object.entries(counts).map(([date, count]) => ({ date, count }))

    const startDate = subYears(new Date(), 1)
    const endDate = new Date()

    return (
        <div className="text-xs">
            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={values}
                classForValue={(value) => {
                    if (!value || value.count === 0) return "color-empty"
                    if (value.count === 1) return "color-scale-1"
                    if (value.count === 2) return "color-scale-2"
                    if (value.count === 3) return "color-scale-3"
                    return "color-scale-4"
                }}
                tooltipDataAttrs={(value: any) => ({
                    "data-tooltip-id": "heatmap-tip",
                    "data-tooltip-content": value?.date
                        ? `${value.count} solved on ${value.date}`
                        : "No problems",
                } as any)}
                showWeekdayLabels
            />
            <Tooltip id="heatmap-tip" />
            <div className="flex items-center gap-1 justify-end mt-2 text-zinc-600 dark:text-zinc-500">
                <span>Less</span>
                {["bg-zinc-200 dark:bg-zinc-800", "bg-emerald-200 dark:bg-emerald-900", "bg-emerald-300 dark:bg-emerald-800", "bg-emerald-400 dark:bg-emerald-700", "bg-emerald-500 dark:bg-emerald-600"].map((c, i) => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
                ))}
                <span>More</span>
            </div>
        </div>
    )
}

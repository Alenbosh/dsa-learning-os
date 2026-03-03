"use client"

import Link from "next/link"
import { GripVertical, FileText } from "lucide-react"
import { formatDate, cn } from "@/lib/utils"

export function TopicCard({
    topic,
    onEdit,
    isSelected = false,
    onClick,
}: {
    topic: any
    onEdit: () => void
    isSelected?: boolean
    onClick?: () => void
}) {
    const confColor =
        !topic.confidence ? "text-zinc-400 dark:text-zinc-600" :
            topic.confidence <= 2 ? "text-rose-400" :
                topic.confidence <= 3 ? "text-amber-400" : "text-emerald-400"

    return (
        <div
            draggable
            onDragStart={(e) => e.dataTransfer.setData("topicId", topic.id)}
            onClick={onClick}
            className={cn(
                "group rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all",
                "bg-white dark:bg-zinc-900 border",
                isSelected
                    ? "border-orange-500/60 ring-2 ring-orange-500/20 shadow-[0_0_0_1px] shadow-orange-500/10"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
            )}
        >
            <div className="flex items-start gap-2">
                <GripVertical
                    size={12}
                    className="text-zinc-400 dark:text-zinc-600 mt-0.5 shrink-0 group-hover:text-zinc-600 dark:group-hover:text-zinc-500"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <Link
                            href={`/dsa/${topic.id}`}
                            className={cn(
                                "font-medium text-sm truncate transition-colors",
                                isSelected ? "text-orange-400" : "hover:text-orange-400"
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {topic.name}
                        </Link>
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit() }}
                            className={cn(
                                "text-[10px] text-zinc-600 dark:text-zinc-500 transition-all",
                                "px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 shrink-0",
                                "hover:text-zinc-900 dark:hover:text-zinc-300",
                                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            )}
                        >
                            Edit
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        {topic.confidence && (
                            <span className={cn("font-mono text-[10px]", confColor)}>
                                {"★".repeat(topic.confidence)}{"☆".repeat(5 - topic.confidence)}
                            </span>
                        )}
                        {topic.problems?.length > 0 && (
                            <span className="text-[10px] text-zinc-600 dark:text-zinc-500 flex items-center gap-1">
                                <FileText size={9} />
                                {topic.problems.length}
                            </span>
                        )}
                        {topic.lastReviewed && (
                            <span className="text-[10px] text-zinc-600 dark:text-zinc-500">
                                {formatDate(topic.lastReviewed)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

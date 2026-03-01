"use client"

import Link from "next/link"
import { GripVertical, FileText } from "lucide-react"
import { formatDate, cn } from "@/lib/utils"

export function TopicCard({ topic, onEdit }: { topic: any; onEdit: () => void }) {
  const confColor =
    !topic.confidence ? "text-zinc-400 dark:text-zinc-600" :
    topic.confidence <= 2 ? "text-rose-400" :
    topic.confidence <= 3 ? "text-amber-400" : "text-emerald-400"

  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("topicId", topic.id)}
      className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 cursor-grab
                 active:cursor-grabbing hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
    >
      <div className="flex items-start gap-2">
        <GripVertical size={12} className="text-zinc-400 dark:text-zinc-600 mt-0.5 shrink-0 group-hover:text-zinc-600 dark:group-hover:text-zinc-500" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/dsa/${topic.id}`}
              className="font-medium text-sm truncate hover:text-orange-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {topic.name}
            </Link>
            <button
              onClick={onEdit}
              className="opacity-0 group-hover:opacity-100 text-[10px] text-zinc-600 dark:text-zinc-500
                         hover:text-zinc-900 dark:hover:text-zinc-300 transition-all px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 shrink-0"
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

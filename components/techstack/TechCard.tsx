"use client"

import { GripVertical, Link2, FolderGit2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function TechCard({ tech, categoryColors, onEdit }: {
  tech: any
  categoryColors: Record<string, string>
  onEdit: () => void
}) {
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("techId", tech.id)}
      className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 cursor-grab
                 active:cursor-grabbing hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
    >
      <div className="flex items-start gap-2">
        <GripVertical size={12} className="text-zinc-400 dark:text-zinc-600 mt-0.5 shrink-0 group-hover:text-zinc-600 dark:group-hover:text-zinc-500" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-sm truncate">{tech.name}</span>
            <button
              onClick={onEdit}
              className="opacity-0 group-hover:opacity-100 text-[10px] text-zinc-600 dark:text-zinc-500
                         hover:text-zinc-900 dark:hover:text-zinc-300 transition-all px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 shrink-0"
            >
              Edit
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {tech.category && (
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded font-medium",
                categoryColors[tech.category] ?? "text-zinc-400 bg-zinc-400/10"
              )}>
                {tech.category}
              </span>
            )}
            {tech.confidence && (
              <span className="text-[10px] font-mono text-orange-400">
                {"★".repeat(tech.confidence)}
              </span>
            )}
          </div>

          {(tech.resources?.length > 0 || tech.projects?.length > 0) && (
            <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-600 dark:text-zinc-500">
              {tech.resources?.length > 0 && (
                <span className="flex items-center gap-1">
                  <Link2 size={9} /> {tech.resources.length}
                </span>
              )}
              {tech.projects?.length > 0 && (
                <span className="flex items-center gap-1">
                  <FolderGit2 size={9} /> {tech.projects.length}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { ExternalLink, RefreshCw, Trophy } from "lucide-react"
import type { ProblemWithTags } from "@/types"
import { DIFFICULTY_COLORS, formatDate, cn } from "@/lib/utils"

export function ProblemsTable({
  problems,
  onEdit,
}: {
  problems: ProblemWithTags[]
  onEdit: (p: ProblemWithTags) => void
}) {
  if (!problems.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-600 dark:text-zinc-600">
        <div className="text-4xl mb-3">🧩</div>
        <div className="text-sm">No problems match your filters</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/80">
              {["#", "Problem", "Difficulty", "Tags", "Date", "Time", "Solved", "Conf.", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
            {problems.map((p, i) => (
              <tr
                key={p.id}
                className="group hover:bg-zinc-100 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <td className="px-4 py-3 font-mono text-[11px] text-zinc-600 dark:text-zinc-600">{i + 1}</td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {p.isContest && <Trophy size={11} className="text-amber-400 shrink-0" />}
                    {p.revisit && <RefreshCw size={11} className="text-rose-400 shrink-0" />}
                    <Link
                      href={`/leetcode/${p.id}`}
                      className="font-medium hover:text-orange-400 transition-colors truncate max-w-[200px]"
                    >
                      {p.name}
                    </Link>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-300 transition-all"
                      >
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className={cn(
                    "text-[11px] font-semibold px-2 py-0.5 rounded border",
                    DIFFICULTY_COLORS[p.difficulty]
                  )}>
                    {p.difficulty}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1 max-w-[180px]">
                    {p.tags.slice(0, 3).map(({ tag }) => (
                      <span key={tag.id} className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded font-mono">
                        {tag.name}
                      </span>
                    ))}
                    {p.tags.length > 3 && (
                      <span className="text-[10px] text-zinc-600 dark:text-zinc-600">+{p.tags.length - 3}</span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3 font-mono text-[11px] text-zinc-600 dark:text-zinc-500 whitespace-nowrap">
                  {formatDate(p.date)}
                </td>

                <td className="px-4 py-3 font-mono text-[11px]">
                  {p.timeTaken ? (
                    <span className={
                      p.timeTaken > 60 ? "text-rose-400" :
                      p.timeTaken > 30 ? "text-amber-400" : "text-emerald-400"
                    }>
                      {p.timeTaken}m
                    </span>
                  ) : <span className="text-zinc-400 dark:text-zinc-700">—</span>}
                </td>

                <td className="px-4 py-3">
                  {p.solved ? (
                    <span className={cn(
                      "text-[11px] font-mono px-2 py-0.5 rounded",
                      p.solved === "Yes" ? "bg-emerald-500/10 text-emerald-400" :
                      p.solved === "Hint" ? "bg-amber-500/10 text-amber-400" :
                      "bg-rose-500/10 text-rose-400"
                    )}>
                      {p.solved === "FullSolution" ? "Full Sol." : p.solved}
                    </span>
                  ) : <span className="text-zinc-400 dark:text-zinc-700">—</span>}
                </td>

                <td className="px-4 py-3 font-mono text-[11px]">
                  {p.confidence ? (
                    <span className="text-orange-400">{"★".repeat(p.confidence)}<span className="text-zinc-300 dark:text-zinc-700">{"★".repeat(5 - p.confidence)}</span></span>
                  ) : <span className="text-zinc-400 dark:text-zinc-700">—</span>}
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => onEdit(p)}
                    className="opacity-0 group-hover:opacity-100 text-xs text-zinc-600 dark:text-zinc-500
                               hover:text-zinc-900 dark:hover:text-zinc-200 transition-all px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

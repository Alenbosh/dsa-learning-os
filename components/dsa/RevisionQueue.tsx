import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { DIFFICULTY_COLORS, cn } from "@/lib/utils"
import type { ProblemWithTags } from "@/types"

export function RevisionQueue({ problems }: { problems: ProblemWithTags[] }) {
  if (!problems.length) {
    return (
      <div className="flex flex-col items-center justify-center h-24 text-zinc-600 text-xs">
        <span className="text-2xl mb-2">🎉</span>
        Nothing to revise!
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {problems.map((p) => (
        <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-colors group">
          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0", DIFFICULTY_COLORS[p.difficulty])}>
            {p.difficulty[0]}
          </span>
          <Link href={`/leetcode/${p.id}`} className="text-xs font-medium flex-1 truncate hover:text-orange-400 transition-colors">
            {p.name}
          </Link>
          {p.url && (
            <a href={p.url} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-zinc-300 transition-all">
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      ))}
      {problems.length > 0 && (
        <Link href="/leetcode?filter=revisit" className="block text-center text-[11px] text-zinc-600 hover:text-orange-400 transition-colors pt-1">
          View all →
        </Link>
      )}
    </div>
  )
}

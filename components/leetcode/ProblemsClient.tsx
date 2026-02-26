"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Filter } from "lucide-react"
import type { ProblemWithTags, TagType } from "@/types"
import { ProblemsTable } from "./ProblemsTable"
import { ProblemModal } from "./ProblemModal"
import { cn } from "@/lib/utils"

type ViewFilter = "all" | "revisit" | "contest-mistakes" | "medium"

const VIEWS: { id: ViewFilter; label: string; emoji: string }[] = [
  { id: "all", label: "All", emoji: "" },
  { id: "revisit", label: "Weak Topics", emoji: "🔥" },
  { id: "contest-mistakes", label: "Contest Mistakes", emoji: "🧠" },
  { id: "medium", label: "Medium Only", emoji: "📊" },
]

export function ProblemsClient({
  initialProblems,
  tags,
}: {
  initialProblems: ProblemWithTags[]
  tags: TagType[]
}) {
  const [problems, setProblems] = useState(initialProblems)
  const [view, setView] = useState<ViewFilter>("all")
  const [search, setSearch] = useState("")
  const [diffFilter, setDiffFilter] = useState("")
  const [tagFilter, setTagFilter] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProblem, setEditingProblem] = useState<ProblemWithTags | null>(null)

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (view === "revisit" && !p.revisit) return false
      if (view === "contest-mistakes" && (!p.isContest || p.solved === "Yes")) return false
      if (view === "medium" && p.difficulty !== "Medium") return false
      if (diffFilter && p.difficulty !== diffFilter) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (tagFilter && !p.tags.some((t) => t.tag.name === tagFilter)) return false
      return true
    })
  }, [problems, view, diffFilter, search, tagFilter])

  const counts = {
    easy: problems.filter((p) => p.difficulty === "Easy").length,
    medium: problems.filter((p) => p.difficulty === "Medium").length,
    hard: problems.filter((p) => p.difficulty === "Hard").length,
  }

  function openAdd() {
    setEditingProblem(null)
    setModalOpen(true)
  }

  function openEdit(problem: ProblemWithTags) {
    setEditingProblem(problem)
    setModalOpen(true)
  }

  function onSaved(saved: ProblemWithTags) {
    setProblems((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = saved
        return next
      }
      return [saved, ...prev]
    })
    setModalOpen(false)
  }

  function onDeleted(id: string) {
    setProblems((prev) => prev.filter((p) => p.id !== id))
    setModalOpen(false)
  }

  return (
    <div className="space-y-4 max-w-7xl">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-mono">
          <span className="text-emerald-400">{counts.easy}E</span>
          <span className="text-amber-400">{counts.medium}M</span>
          <span className="text-rose-400">{counts.hard}H</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-600 dark:text-zinc-400">{problems.length} total</span>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white
                     text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} />
          Add Problem
        </button>
      </div>

      {/* View tabs */}
      <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 w-fit">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              view === v.id
                ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
            )}
          >
            {v.emoji} {v.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            className="pl-8 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm
                       placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 w-56"
          />
        </div>

        <select
          value={diffFilter}
          onChange={(e) => setDiffFilter(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm
                     text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
        >
          <option value="">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm
                     text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600"
        >
          <option value="">All Tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </select>

        {(search || diffFilter || tagFilter) && (
          <button
            onClick={() => { setSearch(""); setDiffFilter(""); setTagFilter("") }}
            className="text-xs text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
          >
            Clear filters
          </button>
        )}

        <span className="text-xs text-zinc-600 dark:text-zinc-500 ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <ProblemsTable
        problems={filtered}
        onEdit={openEdit}
      />

      {/* Modal */}
      {modalOpen && (
        <ProblemModal
          problem={editingProblem}
          tags={tags}
          onSaved={onSaved}
          onDeleted={onDeleted}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

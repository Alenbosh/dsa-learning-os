"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Save, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { NotesEditor } from "./NotesEditor"
import { DIFFICULTY_COLORS, formatDate, cn } from "@/lib/utils"
import type { ProblemWithTags } from "@/types"

export function ProblemDetail({ problem }: { problem: ProblemWithTags & { topicLinks: any[] } }) {
  const [notes, setNotes] = useState(problem.notes ?? "")
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  async function saveNotes() {
    setSaving(true)
    try {
      const res = await fetch(`/api/problems/${problem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      })
      if (!res.ok) throw new Error()
      setDirty(false)
      toast.success("Notes saved")
    } catch {
      toast.error("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <Link href="/leetcode" className="inline-flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
        <ArrowLeft size={13} />
        Back to Problems
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={cn("text-xs font-bold px-2 py-1 rounded border", DIFFICULTY_COLORS[problem.difficulty])}>
              {problem.difficulty}
            </span>
            {problem.isContest && (
              <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20">
                🏆 Contest
              </span>
            )}
            {problem.revisit && (
              <span className="text-xs text-rose-400 bg-rose-400/10 px-2 py-1 rounded border border-rose-400/20">
                🔁 Revisit
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{problem.name}</h1>
          {problem.url && (
            <a
              href={problem.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 mt-1 transition-colors"
            >
              Open on LeetCode <ExternalLink size={12} />
            </a>
          )}
        </div>

        <button
          onClick={saveNotes}
          disabled={saving || !dirty}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shrink-0",
            dirty
              ? "bg-orange-500 hover:bg-orange-400 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-600 cursor-not-allowed"
          )}
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          Save Notes
        </button>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetaCard label="Date Solved" value={formatDate(problem.date)} />
        <MetaCard label="Time Taken" value={problem.timeTaken ? `${problem.timeTaken} min` : "—"} />
        <MetaCard label="Attempts" value={problem.attempts?.toString() ?? "—"} />
        <MetaCard label="Confidence" value={
          problem.confidence
            ? "★".repeat(problem.confidence) + "☆".repeat(5 - problem.confidence)
            : "—"
        } mono />
        <MetaCard label="Solved" value={problem.solved?.replace("FullSolution", "Full Solution") ?? "—"} />
        <MetaCard label="Rating" value={problem.rating?.toString() ?? "—"} />
        {problem.tags.length > 0 && (
          <div className="col-span-2 p-3 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <div className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-500 mb-2">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {problem.tags.map(({ tag }) => (
                <span key={tag.id} className="text-[11px] font-mono px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 rounded">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pattern + Mistake */}
      {(problem.pattern || problem.mistake) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {problem.pattern && (
            <div className="p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <div className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-500 mb-2">💡 Pattern / Core Idea</div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{problem.pattern}</p>
            </div>
          )}
          {problem.mistake && (
            <div className="p-4 bg-rose-950/20 border border-rose-900/30 rounded-xl">
              <div className="text-[10px] uppercase tracking-wider text-rose-600 mb-2">⚠️ Mistake Made</div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{problem.mistake}</p>
            </div>
          )}
        </div>
      )}

      {/* Notes Editor */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm">Notes</h2>
          {dirty && <span className="text-[11px] text-amber-400 font-mono">● Unsaved changes</span>}
        </div>
        <NotesEditor
          content={notes}
          onChange={(val) => {
            setNotes(val)
            setDirty(true)
          }}
          placeholder="Write your solution approach, key insights, code snippets..."
        />
      </div>
    </div>
  )
}

function MetaCard({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="p-3 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <div className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-500 mb-1">{label}</div>
      <div className={cn("text-sm font-medium", mono && "font-mono text-orange-400")}>{value}</div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { X, Trash2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import type { ProblemWithTags, TagType } from "@/types"
import { ALL_TAGS, cn } from "@/lib/utils"

export function ProblemModal({
  problem,
  tags,
  onSaved,
  onDeleted,
  onClose,
}: {
  problem: ProblemWithTags | null
  tags: TagType[]
  onSaved: (p: ProblemWithTags) => void
  onDeleted: (id: string) => void
  onClose: () => void
}) {
  const isEdit = !!problem

  const [form, setForm] = useState({
    name: problem?.name ?? "",
    url: problem?.url ?? "",
    difficulty: problem?.difficulty ?? "Medium",
    date: problem?.date ? new Date(problem.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    timeTaken: problem?.timeTaken?.toString() ?? "",
    attempts: problem?.attempts?.toString() ?? "1",
    solved: problem?.solved ?? "",
    confidence: problem?.confidence?.toString() ?? "",
    rating: problem?.rating?.toString() ?? "",
    pattern: problem?.pattern ?? "",
    mistake: problem?.mistake ?? "",
    isContest: problem?.isContest ?? false,
    revisit: problem?.revisit ?? false,
    tagIds: problem?.tags.map((t) => t.tag.id) ?? [],
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function toggleTag(id: string) {
    setForm((f) => ({
      ...f,
      tagIds: f.tagIds.includes(id) ? f.tagIds.filter((t) => t !== id) : [...f.tagIds, id],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.difficulty) return

    setSaving(true)
    try {
      const body = {
        ...form,
        timeTaken: form.timeTaken ? parseInt(form.timeTaken) : null,
        attempts: form.attempts ? parseInt(form.attempts) : 1,
        confidence: form.confidence ? parseInt(form.confidence) : null,
        rating: form.rating ? parseInt(form.rating) : null,
        solved: form.solved || null,
      }

      const res = await fetch(isEdit ? `/api/problems/${problem!.id}` : "/api/problems", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Failed to save")
      const saved = await res.json()
      onSaved(saved)
      toast.success(isEdit ? "Problem updated!" : "Problem added!")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!problem) return
    if (!confirm(`Delete "${problem.name}"?`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/problems/${problem.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      onDeleted(problem.id)
      toast.success("Problem deleted")
    } catch {
      toast.error("Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
          <h2 className="font-bold text-base">{isEdit ? "Edit Problem" : "Add Problem"}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name + URL */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="field-label">Problem Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Two Sum"
                required
                className="field-input"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="field-label">LeetCode URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://leetcode.com/problems/..."
                className="field-input"
              />
            </div>
          </div>

          {/* Difficulty + Date */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="field-label">Difficulty *</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value as any })}
                className="field-input"
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Date Solved</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="field-input"
              />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Time (min)</label>
              <input
                type="number"
                min="1"
                value={form.timeTaken}
                onChange={(e) => setForm({ ...form, timeTaken: e.target.value })}
                placeholder="25"
                className="field-input"
              />
            </div>
          </div>

          {/* Attempts + Solved + Confidence + Rating */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="field-label">Attempts</label>
              <input
                type="number"
                min="1"
                value={form.attempts}
                onChange={(e) => setForm({ ...form, attempts: e.target.value })}
                className="field-input"
              />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Solved</label>
              <select
                value={form.solved}
                onChange={(e) => setForm({ ...form, solved: e.target.value as any })}
                className="field-input"
              >
                <option value="">—</option>
                <option value="Yes">Yes</option>
                <option value="Hint">Hint</option>
                <option value="FullSolution">Full Solution</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Confidence</label>
              <select
                value={form.confidence}
                onChange={(e) => setForm({ ...form, confidence: e.target.value })}
                className="field-input"
              >
                <option value="">—</option>
                <option value="1">1 — Lucky</option>
                <option value="2">2 — Struggled</option>
                <option value="3">3 — Okay</option>
                <option value="4">4 — Comfortable</option>
                <option value="5">5 — Mastered</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Rating</label>
              <input
                type="number"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                placeholder="1450"
                className="field-input"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="field-label">Topic Tags</label>
            <div className="flex flex-wrap gap-1.5 p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "px-2.5 py-1 rounded text-[11px] font-mono transition-all border",
                    form.tagIds.includes(tag.id)
                      ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
                      : "bg-zinc-800 text-zinc-500 border-transparent hover:border-zinc-600"
                  )}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern + Mistake */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="field-label">Pattern / Core Idea</label>
              <textarea
                value={form.pattern}
                onChange={(e) => setForm({ ...form, pattern: e.target.value })}
                placeholder="Use hashmap to store prefix frequency..."
                rows={3}
                className="field-input resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="field-label">Mistake Made</label>
              <textarea
                value={form.mistake}
                onChange={(e) => setForm({ ...form, mistake: e.target.value })}
                placeholder="Forgot edge case when n=1..."
                rows={3}
                className="field-input resize-none"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isContest}
                onChange={(e) => setForm({ ...form, isContest: e.target.checked })}
                className="accent-orange-500 w-4 h-4"
              />
              <span className="text-sm text-zinc-400">Contest Problem</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.revisit}
                onChange={(e) => setForm({ ...form, revisit: e.target.checked })}
                className="accent-rose-500 w-4 h-4"
              />
              <span className="text-sm text-zinc-400">Needs Revisit</span>
            </label>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
            {isEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Delete
              </button>
            ) : <div />}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400
                           text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 size={13} className="animate-spin" />}
                {isEdit ? "Update" : "Add Problem"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .field-label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #71717a; margin-bottom: 4px; }
        .field-input { width: 100%; background: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 8px 12px; color: #f4f4f5; font-size: 13px; outline: none; transition: border-color 0.15s; font-family: inherit; }
        .field-input:focus { border-color: #52525b; }
        .field-input::placeholder { color: #3f3f46; }
        select.field-input option { background: #18181b; }
      `}</style>
    </div>
  )
}

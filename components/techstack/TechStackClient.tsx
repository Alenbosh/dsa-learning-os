"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"
import { TechCard } from "./TechCard"
import { TechModal } from "./TechModal"
import { STAGE_LABELS, cn } from "@/lib/utils"
import type { LearnStage } from "@/types"

const COLUMNS: { stage: LearnStage; emoji: string; color: string }[] = [
  { stage: "WantToLearn", emoji: "📌", color: "text-zinc-400" },
  { stage: "CurrentlyLearning", emoji: "🔥", color: "text-orange-400" },
  { stage: "BuildingWith", emoji: "🔨", color: "text-blue-400" },
  { stage: "Comfortable", emoji: "✅", color: "text-emerald-400" },
]

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "text-blue-400 bg-blue-400/10",
  Backend: "text-green-400 bg-green-400/10",
  Database: "text-amber-400 bg-amber-400/10",
  DevOps: "text-purple-400 bg-purple-400/10",
  Mobile: "text-pink-400 bg-pink-400/10",
  "ML/AI": "text-rose-400 bg-rose-400/10",
  Tools: "text-cyan-400 bg-cyan-400/10",
  Language: "text-orange-400 bg-orange-400/10",
}

export function TechStackClient({ initialStack }: { initialStack: any[] }) {
  const [stack, setStack] = useState(initialStack)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTech, setEditingTech] = useState<any | null>(null)

  const byStage = (stage: LearnStage) => stack.filter((t) => t.stage === stage)

  async function updateStage(id: string, stage: LearnStage) {
    const prev = stack
    setStack((s) => s.map((t) => t.id === id ? { ...t, stage } : t))
    try {
      const res = await fetch(`/api/techstack/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setStack(prev)
      toast.error("Failed to update")
    }
  }

  function onSaved(saved: any) {
    setStack((prev) => {
      const idx = prev.findIndex((t) => t.id === saved.id)
      if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n }
      return [...prev, saved]
    })
    setModalOpen(false)
  }

  function onDeleted(id: string) {
    setStack((prev) => prev.filter((t) => t.id !== id))
    setModalOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Tech Stack Roadmap</h1>
          <p className="text-xs text-zinc-500 mt-0.5">{stack.length} technologies tracked</p>
        </div>
        <button
          onClick={() => { setEditingTech(null); setModalOpen(true) }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white
                     text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} /> Add Tech
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <div
            key={col.stage}
            className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("techId")
              if (id) updateStage(id, col.stage)
            }}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span>{col.emoji}</span>
                <span className={cn("text-xs font-semibold", col.color)}>
                  {STAGE_LABELS[col.stage]}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded-full">
                {byStage(col.stage).length}
              </span>
            </div>

            <div className="space-y-2 min-h-[80px]">
              {byStage(col.stage).map((tech) => (
                <TechCard
                  key={tech.id}
                  tech={tech}
                  categoryColors={CATEGORY_COLORS}
                  onEdit={() => { setEditingTech(tech); setModalOpen(true) }}
                />
              ))}
              {byStage(col.stage).length === 0 && (
                <div className="flex items-center justify-center h-16 text-zinc-700 text-xs border border-dashed border-zinc-800 rounded-lg">
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <TechModal
          tech={editingTech}
          onSaved={onSaved}
          onDeleted={onDeleted}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

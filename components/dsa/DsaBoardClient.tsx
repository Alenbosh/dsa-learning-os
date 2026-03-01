"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"
import { TopicCard } from "./TopicCard"
import { TopicModal } from "./TopicModal"
import { cn, STATUS_COLORS } from "@/lib/utils"
import type { StudyStatus } from "@/types"

const COLUMNS: { status: StudyStatus; label: string; emoji: string }[] = [
  { status: "NotStarted", label: "Not Started", emoji: "📋" },
  { status: "InProgress", label: "In Progress", emoji: "🔥" },
  { status: "NeedsRevision", label: "Needs Revision", emoji: "⚠️" },
  { status: "Done", label: "Done", emoji: "✅" },
]

export function DsaBoardClient({ initialTopics }: { initialTopics: any[] }) {
  const [topics, setTopics] = useState(initialTopics)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<any | null>(null)

  const byStatus = (status: StudyStatus) =>
    topics.filter((t) => t.status === status)

  async function updateStatus(id: string, status: StudyStatus) {
    const prev = topics
    setTopics((t) => t.map((topic) => topic.id === id ? { ...topic, status } : topic))
    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error()
    } catch {
      setTopics(prev)
      toast.error("Failed to update status")
    }
  }

  function onSaved(saved: any) {
    setTopics((prev) => {
      const idx = prev.findIndex((t) => t.id === saved.id)
      if (idx >= 0) { const n = [...prev]; n[idx] = saved; return n }
      return [...prev, saved]
    })
    setModalOpen(false)
  }

  function onDeleted(id: string) {
    setTopics((prev) => prev.filter((t) => t.id !== id))
    setModalOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">DSA Study Board</h1>
          <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-0.5">{topics.length} topics · drag cards between columns</p>
        </div>
        <button
          onClick={() => { setEditingTopic(null); setModalOpen(true) }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white
                     text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
        >
          <Plus size={14} /> Add Topic
        </button>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <div
            key={col.status}
            className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("topicId")
              if (id) updateStatus(id, col.status)
            }}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm">{col.emoji}</span>
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{col.label}</span>
              </div>
              <span className={cn(
                "text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border",
                STATUS_COLORS[col.status]
              )}>
                {byStatus(col.status).length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2 min-h-[80px]">
              {byStatus(col.status).map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onEdit={() => { setEditingTopic(topic); setModalOpen(true) }}
                />
              ))}
              {byStatus(col.status).length === 0 && (
                <div className="flex items-center justify-center h-16 text-zinc-500 dark:text-zinc-600 text-xs border border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg">
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <TopicModal
          topic={editingTopic}
          onSaved={onSaved}
          onDeleted={onDeleted}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

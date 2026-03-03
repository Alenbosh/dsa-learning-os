"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"
import { TechCard } from "./TechCard"
import { TechModal } from "./TechModal"
import { BoardShortcutsBar } from "@/components/shared/BoardShortcutsBar"
import { useBoardKeyboard } from "@/hooks/useBoardKeyboard"
import { STAGE_LABELS, cn } from "@/lib/utils"
import type { LearnStage } from "@/types"

const COLUMNS: { stage: LearnStage; emoji: string; color: string }[] = [
    { stage: "WantToLearn", emoji: "📌", color: "text-zinc-400" },
    { stage: "CurrentlyLearning", emoji: "🔥", color: "text-orange-400" },
    { stage: "BuildingWith", emoji: "🔨", color: "text-blue-400" },
    { stage: "Comfortable", emoji: "✅", color: "text-emerald-400" },
]

const COLUMN_KEYS = COLUMNS.map((c) => c.stage) as readonly string[]

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
    const [selectedId, setSelectedId] = useState<string | null>(null)

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

    function openAddModal() {
        setEditingTech(null)
        setModalOpen(true)
    }

    function openEditModal(tech: any) {
        setEditingTech(tech)
        setModalOpen(true)
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
        setSelectedId(null)
        setModalOpen(false)
    }

    // ── Keyboard navigation ────────────────────────────────────
    useBoardKeyboard({
        columns: COLUMN_KEYS,
        items: stack,
        columnKey: "stage",
        selectedId,
        setSelectedId,
        onAddNew: openAddModal,
        onEdit: openEditModal,
        onMove: (id, newStage) => updateStage(id, newStage as LearnStage),
        disabled: modalOpen,
    })

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold">Tech Stack Roadmap</h1>
                    <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-0.5">
                        {stack.length} technologies tracked · drag or use keyboard to move cards
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white
                     text-sm font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                    <Plus size={14} /> Add Tech
                </button>
            </div>

            {/* Keyboard hints */}
            <div className="relative">
                <BoardShortcutsBar hasSelection={!!selectedId} />
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {COLUMNS.map((col, colIdx) => (
                    <div
                        key={col.stage}
                        className={cn(
                            "bg-white dark:bg-zinc-900/40 border rounded-xl p-3 transition-colors",
                            selectedId &&
                                stack.find((t) => t.id === selectedId)?.stage === col.stage
                                ? "border-orange-500/30 dark:border-orange-500/20"
                                : "border-zinc-200 dark:border-zinc-800"
                        )}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            const id = e.dataTransfer.getData("techId")
                            if (id) updateStage(id, col.stage)
                        }}
                    >
                        {/* Column header */}
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <span>{col.emoji}</span>
                                <span className={cn("text-xs font-semibold", col.color)}>
                                    {STAGE_LABELS[col.stage]}
                                </span>
                                {/* column number hint */}
                                <kbd className="hidden xl:inline text-[9px] font-mono px-1 py-0.5 rounded
                                border border-zinc-200 dark:border-zinc-800
                                text-zinc-400 dark:text-zinc-600 leading-none">
                                    {colIdx + 1}
                                </kbd>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-500
                               bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                                {byStage(col.stage).length}
                            </span>
                        </div>

                        {/* Cards */}
                        <div className="space-y-2 min-h-[80px]">
                            {byStage(col.stage).map((tech) => (
                                <TechCard
                                    key={tech.id}
                                    tech={tech}
                                    categoryColors={CATEGORY_COLORS}
                                    isSelected={selectedId === tech.id}
                                    onClick={() => setSelectedId(
                                        selectedId === tech.id ? null : tech.id
                                    )}
                                    onEdit={() => openEditModal(tech)}
                                />
                            ))}
                            {byStage(col.stage).length === 0 && (
                                <div className="flex items-center justify-center h-16 text-zinc-500 dark:text-zinc-600
                                text-xs border border-dashed border-zinc-300 dark:border-zinc-800 rounded-lg">
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
                    onClose={() => {
                        setModalOpen(false)
                        setEditingTech(null)
                    }}
                />
            )}
        </div>
    )
}

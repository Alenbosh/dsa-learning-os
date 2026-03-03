"use client"

import { useState, useEffect, useRef } from "react"
import { X, Trash2, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { DSA_TOPICS } from "@/lib/utils"

export function TopicModal({ topic, onSaved, onDeleted, onClose }: {
    topic: any | null
    onSaved: (t: any) => void
    onDeleted: (id: string) => void
    onClose: () => void
}) {
    const isEdit = !!topic
    const [form, setForm] = useState({
        name: topic?.name ?? "",
        status: topic?.status ?? "NotStarted",
        confidence: topic?.confidence?.toString() ?? "",
    })
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const nameRef = useRef<HTMLInputElement>(null)

    // Auto-focus name field the moment the modal mounts
    useEffect(() => {
        const t = setTimeout(() => nameRef.current?.focus(), 30)
        return () => clearTimeout(t)
    }, [])

    // Cmd/Ctrl+Enter anywhere in the modal → submit
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault()
                if (!saving && form.name.trim()) handleSubmit()
            }
            if (e.key === "Escape") {
                e.preventDefault()
                onClose()
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, saving])

    async function handleSubmit(e?: React.FormEvent) {
        e?.preventDefault()
        if (!form.name.trim()) { nameRef.current?.focus(); return }
        setSaving(true)
        try {
            const body = {
                ...form,
                confidence: form.confidence ? parseInt(form.confidence) : null,
            }
            const res = await fetch(isEdit ? `/api/topics/${topic.id}` : "/api/topics", {
                method: isEdit ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            if (!res.ok) throw new Error()
            const saved = await res.json()
            onSaved(saved)
            toast.success(isEdit ? "Topic updated" : "Topic added")
        } catch {
            toast.error("Something went wrong")
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete() {
        if (!confirm(`Delete "${topic.name}"?`)) return
        setDeleting(true)
        try {
            await fetch(`/api/topics/${topic.id}`, { method: "DELETE" })
            onDeleted(topic.id)
            toast.success("Topic deleted")
        } catch {
            toast.error("Failed to delete")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="font-bold text-sm">{isEdit ? "Edit Topic" : "Add DSA Topic"}</h2>
                    <div className="flex items-center gap-2">
                        {/* Keyboard hint */}
                        <span className="hidden sm:flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-600">
                            <kbd className="modal-kbd">⌘</kbd><kbd className="modal-kbd">↵</kbd>
                            <span>to save</span>
                        </span>
                        <button onClick={onClose} className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">

                    {/* Name — autoFocused, Tab goes to Status */}
                    <div className="space-y-1.5">
                        <label className="field-label">Topic Name *</label>
                        <input
                            ref={nameRef}
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="e.g. Dynamic Programming"
                            list="dsa-topics-list"
                            required
                            className="field-input"
                        />
                        <datalist id="dsa-topics-list">
                            {DSA_TOPICS.map((t) => <option key={t} value={t} />)}
                        </datalist>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="field-label">Status</label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="field-input"
                            >
                                <option value="NotStarted">Not Started</option>
                                <option value="InProgress">In Progress</option>
                                <option value="NeedsRevision">Needs Revision</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>

                        {/* Confidence */}
                        <div className="space-y-1.5">
                            <label className="field-label">Confidence</label>
                            <select
                                value={form.confidence}
                                onChange={(e) => setForm({ ...form, confidence: e.target.value })}
                                className="field-input"
                            >
                                <option value="">—</option>
                                <option value="1">1 — Clueless</option>
                                <option value="2">2 — Shaky</option>
                                <option value="3">3 — Getting it</option>
                                <option value="4">4 — Solid</option>
                                <option value="5">5 — Strong</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        {isEdit ? (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300"
                            >
                                {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                                Delete
                            </button>
                        ) : <div />}

                        <div className="flex gap-3 items-center">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-sm text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 px-3 py-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving || !form.name.trim()}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400
                           text-white text-sm font-semibold rounded-lg transition-colors
                           disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                {saving && <Loader2 size={12} className="animate-spin" />}
                                {isEdit ? "Update" : "Add Topic"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx global>{`
        .field-label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #52525b; margin-bottom: 4px; }
        .field-input { width: 100%; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; padding: 8px 12px; color: #18181b; font-size: 13px; outline: none; transition: border-color 0.15s; font-family: inherit; }
        .field-input:focus { border-color: #a1a1aa; }
        .field-input::placeholder { color: #a1a1aa; }
        select.field-input option { background: #ffffff; color: #18181b; }
        html.dark .field-label { color: #71717a; }
        html.dark .field-input { background: #09090b; border-color: #27272a; color: #f4f4f5; }
        html.dark .field-input:focus { border-color: #52525b; }
        html.dark .field-input::placeholder { color: #3f3f46; }
        html.dark select.field-input option { background: #18181b; color: #f4f4f5; }
        .modal-kbd {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 18px; height: 18px; padding: 0 4px;
          border-radius: 4px; border: 1px solid;
          font-size: 10px; font-family: monospace; font-weight: 600;
          line-height: 1; user-select: none;
          border-color: #d4d4d8; background: #f4f4f5; color: #71717a;
        }
        html.dark .modal-kbd {
          border-color: #3f3f46; background: #27272a; color: #a1a1aa;
        }
      `}</style>
        </div>
    )
}

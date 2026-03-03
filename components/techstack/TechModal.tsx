"use client"

import { useState, useEffect, useRef } from "react"
import { X, Trash2, Loader2, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { TECH_CATEGORIES, STAGE_LABELS } from "@/lib/utils"

export function TechModal({ tech, onSaved, onDeleted, onClose }: {
    tech: any | null
    onSaved: (t: any) => void
    onDeleted: (id: string) => void
    onClose: () => void
}) {
    const isEdit = !!tech
    const [form, setForm] = useState({
        name: tech?.name ?? "",
        category: tech?.category ?? "",
        stage: tech?.stage ?? "WantToLearn",
        confidence: tech?.confidence?.toString() ?? "",
        notes: tech?.notes ?? "",
    })
    const [resources, setResources] = useState<{ title: string; url: string }[]>(tech?.resources ?? [])
    const [newResource, setNewResource] = useState({ title: "", url: "" })
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const nameRef = useRef<HTMLInputElement>(null)
    const resTitleRef = useRef<HTMLInputElement>(null)
    const resUrlRef = useRef<HTMLInputElement>(null)

    // Auto-focus name field on mount
    useEffect(() => {
        const t = setTimeout(() => nameRef.current?.focus(), 30)
        return () => clearTimeout(t)
    }, [])

    // Cmd/Ctrl+Enter anywhere → submit; Escape → close
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
                resources,
            }
            const res = await fetch(isEdit ? `/api/techstack/${tech.id}` : "/api/techstack", {
                method: isEdit ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            if (!res.ok) throw new Error()
            const saved = await res.json()
            onSaved(saved)
            toast.success(isEdit ? "Updated" : "Tech added")
        } catch {
            toast.error("Something went wrong")
        } finally {
            setSaving(false)
        }
    }

    function addResource() {
        if (newResource.title && newResource.url) {
            setResources([...resources, newResource])
            setNewResource({ title: "", url: "" })
            resTitleRef.current?.focus()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
                    <h2 className="font-bold text-sm">{isEdit ? "Edit Technology" : "Add Technology"}</h2>
                    <div className="flex items-center gap-2">
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
                    <div className="grid grid-cols-2 gap-4">

                        {/* Name — autoFocus */}
                        <div className="col-span-2 space-y-1.5">
                            <label className="field-label">Technology Name *</label>
                            <input
                                ref={nameRef}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Next.js, Redis, Docker..."
                                required
                                className="field-input"
                            />
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5">
                            <label className="field-label">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="field-input"
                            >
                                <option value="">—</option>
                                {TECH_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Stage */}
                        <div className="space-y-1.5">
                            <label className="field-label">Stage</label>
                            <select
                                value={form.stage}
                                onChange={(e) => setForm({ ...form, stage: e.target.value })}
                                className="field-input"
                            >
                                {Object.entries(STAGE_LABELS).map(([v, l]) => (
                                    <option key={v} value={v}>{l}</option>
                                ))}
                            </select>
                        </div>

                        {/* Confidence */}
                        <div className="col-span-2 space-y-1.5">
                            <label className="field-label">Confidence</label>
                            <select
                                value={form.confidence}
                                onChange={(e) => setForm({ ...form, confidence: e.target.value })}
                                className="field-input"
                            >
                                <option value="">—</option>
                                <option value="1">1 — Just heard of it</option>
                                <option value="2">2 — Read about it</option>
                                <option value="3">3 — Used it a bit</option>
                                <option value="4">4 — Built projects</option>
                                <option value="5">5 — Production ready</option>
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <label className="field-label">Notes</label>
                        <textarea
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                            placeholder="Why learn this? Key concepts to focus on..."
                            rows={3}
                            className="field-input resize-none"
                        />
                    </div>

                    {/* Resources */}
                    <div className="space-y-2">
                        <label className="field-label">Learning Resources</label>
                        <div className="space-y-1.5">
                            {resources.map((r, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2">
                                    <a href={r.url} target="_blank" rel="noreferrer" className="flex-1 truncate hover:text-orange-400 transition-colors">
                                        {r.title}
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setResources(resources.filter((_, j) => j !== i))}
                                        className="text-zinc-500 dark:text-zinc-600 hover:text-rose-400 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                ref={resTitleRef}
                                value={newResource.title}
                                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                                onKeyDown={(e) => { if (e.key === "Tab" && newResource.title) resUrlRef.current?.focus() }}
                                placeholder="Title"
                                className="field-input flex-1 text-xs py-1.5"
                            />
                            <input
                                ref={resUrlRef}
                                value={newResource.url}
                                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addResource() } }}
                                placeholder="URL"
                                className="field-input flex-1 text-xs py-1.5"
                            />
                            <button
                                type="button"
                                onClick={addResource}
                                className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-zinc-600 dark:text-zinc-400"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-600">
                            Press <kbd className="modal-kbd">Enter</kbd> on the URL field to add a resource
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        {isEdit ? (
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!confirm(`Delete "${tech.name}"?`)) return
                                    setDeleting(true)
                                    try {
                                        await fetch(`/api/techstack/${tech.id}`, { method: "DELETE" })
                                        onDeleted(tech.id)
                                    } catch { toast.error("Failed to delete") }
                                    finally { setDeleting(false) }
                                }}
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
                                {isEdit ? "Update" : "Add Tech"}
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

"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
    Search, Star, ExternalLink, Trash2, Loader2,
    BookOpen, X, SlidersHorizontal, ArrowUpDown
} from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { DOCS_CATALOG, CATALOG_CATEGORIES, type DocEntry, type CatalogCategory } from "@/lib/docs-catalog"

interface Bookmark {
    id: string
    name: string
    url: string
    description: string | null
    category: string | null
    createdAt: string
}

const CATEGORY_COLORS: Record<string, string> = {
    DSA: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    Language: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    Frontend: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    Backend: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Database: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    DevOps: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    Mobile: "text-pink-400 bg-pink-400/10 border-pink-400/20",
    Tool: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    CS: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
    "AI/ML": "text-purple-400 bg-purple-400/10 border-purple-400/20",
}

type SortOption = "name" | "recent"
type Tab = "search" | "starred"

export function DocsClient({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
    const [tab, setTab] = useState<Tab>("search")
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const [query, setQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState<CatalogCategory>("All")
    const [sort, setSort] = useState<SortOption>("name")
    const [starring, setStarring] = useState<Set<string>>(new Set()) // urls being toggled

    // Derive a Set of starred URLs for O(1) lookup
    const starredUrls = useMemo(() => new Set(bookmarks.map((b) => b.url)), [bookmarks])

    // Debounced search — filter catalog client-side
    const filtered = useMemo(() => {
        const q = query.toLowerCase().trim()
        return DOCS_CATALOG.filter((entry) => {
            const matchesQuery =
                !q ||
                entry.name.toLowerCase().includes(q) ||
                entry.description.toLowerCase().includes(q) ||
                entry.category.toLowerCase().includes(q)
            const matchesCategory =
                activeCategory === "All" || entry.category === activeCategory
            return matchesQuery && matchesCategory
        })
    }, [query, activeCategory])

    // Sorted bookmarks
    const sortedBookmarks = useMemo(() => {
        return [...bookmarks].sort((a, b) => {
            if (sort === "name") return a.name.localeCompare(b.name)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
    }, [bookmarks, sort])

    async function toggleStar(entry: DocEntry) {
        if (starring.has(entry.url)) return
        setStarring((s) => new Set(s).add(entry.url))

        const isStarred = starredUrls.has(entry.url)

        try {
            if (isStarred) {
                // find the bookmark to delete
                const bm = bookmarks.find((b) => b.url === entry.url)
                if (!bm) return
                const res = await fetch(`/api/docs/bookmarks/${bm.id}`, { method: "DELETE" })
                if (!res.ok) throw new Error()
                setBookmarks((prev) => prev.filter((b) => b.url !== entry.url))
                toast.success(`Removed "${entry.name}"`)
            } else {
                const res = await fetch("/api/docs/bookmarks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: entry.name,
                        url: entry.url,
                        description: entry.description,
                        category: entry.category,
                    }),
                })
                if (!res.ok) throw new Error()
                const saved: Bookmark = await res.json()
                setBookmarks((prev) => [saved, ...prev])
                toast.success(`Starred "${entry.name}"`)
            }
        } catch {
            toast.error("Something went wrong")
        } finally {
            setStarring((s) => {
                const n = new Set(s)
                n.delete(entry.url)
                return n
            })
        }
    }

    async function removeBookmark(bm: Bookmark) {
        try {
            const res = await fetch(`/api/docs/bookmarks/${bm.id}`, { method: "DELETE" })
            if (!res.ok) throw new Error()
            setBookmarks((prev) => prev.filter((b) => b.id !== bm.id))
            toast.success(`Removed "${bm.name}"`)
        } catch {
            toast.error("Failed to remove")
        }
    }

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-lg font-bold">Docs</h1>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        Search and star documentation you actually use
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-1">
                    <button
                        onClick={() => setTab("search")}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            tab === "search"
                                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300"
                        )}
                    >
                        <Search size={12} /> Search
                    </button>
                    <button
                        onClick={() => setTab("starred")}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            tab === "starred"
                                ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300"
                        )}
                    >
                        <Star size={12} />
                        Starred
                        {bookmarks.length > 0 && (
                            <span className="ml-0.5 text-[10px] font-mono bg-orange-500/15 text-orange-400 px-1.5 py-0.5 rounded-full border border-orange-500/20">
                                {bookmarks.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* ── SEARCH TAB ────────────────────────────────────────── */}
            {tab === "search" && (
                <div className="space-y-4">
                    {/* Search input */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search docs… e.g. binary search, react, postgres"
                            className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-10 py-3
                         text-sm placeholder-zinc-500 dark:placeholder-zinc-600 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600
                         transition-colors"
                        />
                        {query && (
                            <button
                                onClick={() => setQuery("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-400"
                            >
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    {/* Category filter pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {CATALOG_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                                    activeCategory === cat
                                        ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
                                        : "text-zinc-600 dark:text-zinc-500 border-zinc-300 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Result count */}
                    <div className="flex items-center justify-between">
                        <p className="text-[11px] text-zinc-600">
                            {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
                            {query && ` for "${query}"`}
                        </p>
                    </div>

                    {/* Results grid */}
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-zinc-600 dark:text-zinc-500 gap-2">
                            <BookOpen size={28} />
                            <span className="text-sm">No results found. Try a different search.</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {filtered.map((entry) => {
                                const isStarred = starredUrls.has(entry.url)
                                const isLoading = starring.has(entry.url)
                                return (
                                    <SearchResultCard
                                        key={entry.url}
                                        entry={entry}
                                        isStarred={isStarred}
                                        isLoading={isLoading}
                                        onToggleStar={() => toggleStar(entry)}
                                    />
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── STARRED TAB ───────────────────────────────────────── */}
            {tab === "starred" && (
                <div className="space-y-4">
                    {bookmarks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-600 dark:text-zinc-500">
                            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                                <Star size={20} />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-zinc-500">No docs starred yet</p>
                                <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-1">
                                    Search and star resources to save them here
                                </p>
                            </div>
                            <button
                                onClick={() => setTab("search")}
                                className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
                            >
                                Browse docs →
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Sort control */}
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] text-zinc-600">
                                    {bookmarks.length} starred resource{bookmarks.length !== 1 ? "s" : ""}
                                </p>
                                <div className="flex items-center gap-1">
                                    <ArrowUpDown size={11} className="text-zinc-600" />
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value as SortOption)}
                                        className="text-xs bg-transparent text-zinc-500 dark:text-zinc-400 border-none outline-none cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
                                    >
                                        <option value="recent">Most recent</option>
                                        <option value="name">Name A–Z</option>
                                    </select>
                                </div>
                            </div>

                            {/* Grouped by category */}
                            {(["DSA", "Language", "Frontend", "Backend", "Database", "DevOps", "Mobile", "Tool", "CS", "AI/ML"] as const).map((cat) => {
                                const items = sortedBookmarks.filter((b) => b.category === cat)
                                if (items.length === 0) return null
                                return (
                                    <div key={cat} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded border",
                                                CATEGORY_COLORS[cat]
                                            )}>
                                                {cat}
                                            </span>
                                            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800/60" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {items.map((bm) => (
                                                <BookmarkCard
                                                    key={bm.id}
                                                    bookmark={bm}
                                                    onRemove={() => removeBookmark(bm)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Uncategorised */}
                            {sortedBookmarks.filter((b) => !b.category).length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded border text-zinc-600 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700">
                                            Other
                                        </span>
                                        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800/60" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {sortedBookmarks
                                            .filter((b) => !b.category)
                                            .map((bm) => (
                                                <BookmarkCard
                                                    key={bm.id}
                                                    bookmark={bm}
                                                    onRemove={() => removeBookmark(bm)}
                                                />
                                            ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

// ── Sub-components ─────────────────────────────────────────────

function SearchResultCard({
    entry,
    isStarred,
    isLoading,
    onToggleStar,
}: {
    entry: DocEntry
    isStarred: boolean
    isLoading: boolean
    onToggleStar: () => void
}) {
    return (
        <div className="group flex items-start gap-3 p-3.5 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800
                    rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/70 transition-all">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold truncate">{entry.name}</span>
                    <span className={cn(
                        "shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                        CATEGORY_COLORS[entry.category]
                    )}>
                        {entry.category}
                    </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{entry.description}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                    title="Open docs"
                >
                    <ExternalLink size={13} />
                </a>
                <button
                    onClick={onToggleStar}
                    disabled={isLoading}
                    className={cn(
                        "p-1.5 rounded-lg transition-all disabled:opacity-50",
                        isStarred
                            ? "text-amber-400 hover:text-amber-300 hover:bg-amber-400/10"
                            : "text-zinc-600 dark:text-zinc-500 hover:text-amber-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                    title={isStarred ? "Remove from starred" : "Star this doc"}
                >
                    {isLoading ? (
                        <Loader2 size={13} className="animate-spin" />
                    ) : (
                        <Star size={13} className={isStarred ? "fill-amber-400" : ""} />
                    )}
                </button>
            </div>
        </div>
    )
}

function BookmarkCard({
    bookmark,
    onRemove,
}: {
    bookmark: Bookmark
    onRemove: () => void
}) {
    return (
        <div className="group flex items-start gap-3 p-3.5 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800
                    rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/70 transition-all">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold truncate">{bookmark.name}</span>
                </div>
                {bookmark.description && (
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
                        {bookmark.description}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                     text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent
                     hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                >
                    <ExternalLink size={11} />
                    Visit
                </a>
                <button
                    onClick={onRemove}
                    className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
                    title="Remove"
                >
                    <Trash2 size={13} />
                </button>
            </div>
        </div>
    )
}

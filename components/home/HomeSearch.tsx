"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
    Search, Code2, Brain, Layers, BookOpen,
    ExternalLink, ArrowRight, Loader2, X, Globe
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DOCS_CATALOG } from "@/lib/docs-catalog"
import type { SearchResult } from "@/app/api/search/route"

// ── Static docs catalog results (no API needed) ───────────────

interface DocsCatalogResult {
    id: string
    type: "docs-catalog"
    label: string
    sublabel: string
    href: string       // always /docs
    externalUrl: string
    badge: string
    badgeColor: string
}

function searchDocsCatalog(q: string): DocsCatalogResult[] {
    if (!q.trim()) return []
    const lower = q.toLowerCase()
    return DOCS_CATALOG
        .filter((d) =>
            d.name.toLowerCase().includes(lower) ||
            d.description.toLowerCase().includes(lower) ||
            d.category.toLowerCase().includes(lower)
        )
        .slice(0, 4)
        .map((d) => ({
            id: `catalog-${d.url}`,
            type: "docs-catalog" as const,
            label: d.name,
            sublabel: d.description,
            href: "/docs",
            externalUrl: d.url,
            badge: d.category,
            badgeColor: "text-violet-400",
        }))
}

// ── Type icons + labels ───────────────────────────────────────

const TYPE_META: Record<string, { icon: React.ReactNode; group: string }> = {
    problem: { icon: <Code2 size={13} />, group: "Your LeetCode Problems" },
    topic: { icon: <Brain size={13} />, group: "DSA Topics" },
    tech: { icon: <Layers size={13} />, group: "Tech Stack" },
    bookmark: { icon: <BookOpen size={13} />, group: "Starred Docs" },
    "docs-catalog": { icon: <BookOpen size={13} />, group: "Documentation" },
}

// ── Google fallback item ──────────────────────────────────────

function googleUrl(q: string) {
    return `https://www.google.com/search?q=${encodeURIComponent(q)}`
}

// ── Debounce hook ─────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(t)
    }, [value, delay])
    return debounced
}

// ── Main component ────────────────────────────────────────────

export function HomeSearch() {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [dbResults, setDbResults] = useState<SearchResult[]>([])
    const [open, setOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)

    const debouncedQuery = useDebounce(query, 220)

    // Static docs catalog results (instant, no API)
    const catalogResults = useMemo(
        () => searchDocsCatalog(debouncedQuery),
        [debouncedQuery]
    )

    // Fetch DB results whenever debounced query changes
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setDbResults([])
            setLoading(false)
            return
        }

        setLoading(true)
        const controller = new AbortController()

        fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
            signal: controller.signal,
        })
            .then((r) => r.json())
            .then((data: SearchResult[]) => {
                setDbResults(data)
                setLoading(false)
            })
            .catch((err) => {
                if (err.name !== "AbortError") setLoading(false)
            })

        return () => controller.abort()
    }, [debouncedQuery])

    // Merge: DB results first, then catalog results (deduplicate by label)
    const allResults = useMemo(() => {
        const seen = new Set(dbResults.map((r) => r.label.toLowerCase()))
        const filtered = catalogResults.filter(
            (r) => !seen.has(r.label.toLowerCase())
        )
        return [...dbResults, ...filtered]
    }, [dbResults, catalogResults])

    // Total items including Google fallback
    const totalItems = allResults.length + 1 // +1 for Google

    // Reset active index when results change
    useEffect(() => { setActiveIndex(0) }, [allResults.length, debouncedQuery])

    // Show/hide dropdown
    useEffect(() => {
        setOpen(!!query.trim())
    }, [query])

    // Click outside to close
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [])

    // Navigate to a result
    const goTo = useCallback((result: SearchResult | DocsCatalogResult) => {
        setOpen(false)
        setQuery("")

        // If it has an external URL (bookmark or catalog), open in new tab
        if ("externalUrl" in result && result.externalUrl) {
            window.open(result.externalUrl, "_blank", "noopener,noreferrer")
            return
        }
        router.push(result.href)
    }, [router])

    // Google fallback
    const goGoogle = useCallback(() => {
        setOpen(false)
        setQuery("")
        window.open(googleUrl(query), "_blank", "noopener,noreferrer")
    }, [query])

    // Keyboard navigation
    function onKeyDown(e: React.KeyboardEvent) {
        if (!open) return

        if (e.key === "ArrowDown") {
            e.preventDefault()
            setActiveIndex((i) => Math.min(i + 1, totalItems - 1))
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setActiveIndex((i) => Math.max(i - 1, 0))
        } else if (e.key === "Enter") {
            e.preventDefault()
            if (activeIndex < allResults.length) {
                goTo(allResults[activeIndex])
            } else {
                goGoogle()
            }
        } else if (e.key === "Escape") {
            setOpen(false)
            inputRef.current?.blur()
        }
    }

    // Group results by type
    const grouped = useMemo(() => {
        const groups: Record<string, (SearchResult | DocsCatalogResult)[]> = {}
        for (const r of allResults) {
            const group = TYPE_META[r.type]?.group ?? "Other"
            if (!groups[group]) groups[group] = []
            groups[group].push(r)
        }
        return groups
    }, [allResults])

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
            {/* Search input */}
            <div className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200",
                "bg-white dark:bg-zinc-900/80",
                open
                    ? "border-orange-500/40 shadow-[0_0_0_3px_rgba(249,115,22,0.08)] dark:border-orange-500/30"
                    : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm"
            )}>
                {loading
                    ? <Loader2 size={16} className="shrink-0 text-orange-400 animate-spin" />
                    : <Search size={16} className="shrink-0 text-zinc-400 dark:text-zinc-500" />
                }
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onKeyDown}
                    onFocus={() => query.trim() && setOpen(true)}
                    placeholder="Search problems, topics, docs, tech… or anything"
                    className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-zinc-100
                     placeholder-zinc-400 dark:placeholder-zinc-600
                     outline-none caret-orange-500"
                    spellCheck={false}
                    autoComplete="off"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(""); setOpen(false) }}
                        className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute top-full left-0 right-0 mt-2 z-40
                        rounded-xl border border-zinc-200 dark:border-zinc-700/60
                        bg-white dark:bg-zinc-900
                        shadow-[0_16px_48px_rgba(0,0,0,0.15)] dark:shadow-[0_16px_64px_rgba(0,0,0,0.5)]
                        overflow-hidden"
                    style={{ animation: "srDropdown 130ms cubic-bezier(0.16,1,0.3,1)" }}
                >
                    {/* Results */}
                    {allResults.length > 0 ? (
                        <div className="max-h-[420px] overflow-y-auto overscroll-contain">
                            {Object.entries(grouped).map(([group, items]) => (
                                <div key={group}>
                                    {/* Group header */}
                                    <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest
                                text-zinc-400 dark:text-zinc-600">
                                        {group}
                                    </p>
                                    {items.map((result) => {
                                        const flatIdx = allResults.indexOf(result as any)
                                        const isActive = flatIdx === activeIndex
                                        const meta = TYPE_META[result.type]

                                        return (
                                            <button
                                                key={result.id}
                                                onClick={() => goTo(result as any)}
                                                onMouseEnter={() => setActiveIndex(flatIdx)}
                                                className={cn(
                                                    "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-75",
                                                    isActive
                                                        ? "bg-zinc-50 dark:bg-zinc-800"
                                                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                                )}
                                            >
                                                {/* Type icon */}
                                                <span className={cn(
                                                    "flex items-center justify-center w-7 h-7 rounded-lg shrink-0 border transition-colors",
                                                    isActive
                                                        ? "bg-orange-500/10 border-orange-500/25 text-orange-500 dark:text-orange-400"
                                                        : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500"
                                                )}>
                                                    {meta?.icon}
                                                </span>

                                                {/* Text */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                                        {result.label}
                                                    </p>
                                                    {result.sublabel && (
                                                        <p className="text-[11px] text-zinc-500 dark:text-zinc-600 truncate">
                                                            {result.sublabel}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Badge + action icon */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {result.badge && (
                                                        <span className={cn(
                                                            "text-[10px] font-medium font-mono px-1.5 py-0.5 rounded",
                                                            "bg-zinc-100 dark:bg-zinc-800",
                                                            result.badgeColor
                                                        )}>
                                                            {result.badge}
                                                        </span>
                                                    )}
                                                    {"externalUrl" in result && result.externalUrl ? (
                                                        <ExternalLink size={12} className="text-zinc-400" />
                                                    ) : (
                                                        <ArrowRight size={12} className={cn(
                                                            "text-zinc-300 dark:text-zinc-700 transition-colors",
                                                            isActive && "text-orange-400 dark:text-orange-400"
                                                        )} />
                                                    )}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}

                            {/* Divider before Google */}
                            <div className="h-px bg-zinc-100 dark:bg-zinc-800 mx-4 my-1" />
                        </div>
                    ) : (
                        /* Empty state before Google */
                        !loading && (
                            <div className="px-4 pt-4 pb-2 text-xs text-zinc-500 dark:text-zinc-600">
                                No results found in your data
                            </div>
                        )
                    )}

                    {/* Google fallback — always shown when there's a query */}
                    <button
                        onClick={goGoogle}
                        onMouseEnter={() => setActiveIndex(allResults.length)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                            activeIndex === allResults.length
                                ? "bg-zinc-50 dark:bg-zinc-800"
                                : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        )}
                    >
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0
                             border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
                            <Globe size={13} className="text-blue-500" />
                        </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Search Google for &ldquo;{query}&rdquo;
                            </p>
                            <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
                                Opens in a new tab
                            </p>
                        </div>
                        <ExternalLink size={12} className="text-zinc-400 shrink-0" />
                    </button>
                </div>
            )}

            {/* Subtle hint below input */}
            {!open && (
                <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-600 mt-2.5">
                    Search your problems, DSA topics, docs, tech stack — or fall back to Google
                </p>
            )}

            <style>{`
        @keyframes srDropdown {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
        </div>
    )
}

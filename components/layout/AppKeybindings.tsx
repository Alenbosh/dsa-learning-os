"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
    Home, Code2, Brain, Layers, BookOpen,
    CalendarDays, Settings, Search,
    CornerDownLeft, X, Keyboard
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Command definitions ───────────────────────────────────────

interface Command {
    id: string
    label: string
    description?: string
    href?: string
    shortcut?: string[]
    icon: React.ReactNode
    group: "Navigation"
    keywords?: string
}

const NAV_COMMANDS: Command[] = [
    {
        id: "home",
        label: "Home",
        description: "Dashboard & overview",
        href: "/",
        shortcut: ["G", "H"],
        icon: <Home size={14} />,
        group: "Navigation",
        keywords: "dashboard overview streak heatmap",
    },
    {
        id: "leetcode",
        label: "LeetCode Tracker",
        description: "Problems, patterns & notes",
        href: "/leetcode",
        shortcut: ["G", "L"],
        icon: <Code2 size={14} />,
        group: "Navigation",
        keywords: "problems coding algorithms easy medium hard",
    },
    {
        id: "dsa",
        label: "DSA Study Board",
        description: "Topics, revision & spaced repetition",
        href: "/dsa",
        shortcut: ["G", "D"],
        icon: <Brain size={14} />,
        group: "Navigation",
        keywords: "data structures kanban sm2 review cards",
    },
    {
        id: "techstack",
        label: "Tech Stack",
        description: "Your learning pipeline",
        href: "/techstack",
        shortcut: ["G", "T"],
        icon: <Layers size={14} />,
        group: "Navigation",
        keywords: "technology frameworks tools currently learning",
    },
    {
        id: "docs",
        label: "Docs",
        description: "Search & star documentation",
        href: "/docs",
        shortcut: ["G", "O"],
        icon: <BookOpen size={14} />,
        group: "Navigation",
        keywords: "documentation references bookmarks starred",
    },
    {
        id: "review",
        label: "Weekly Review",
        description: "Progress by week",
        href: "/review",
        shortcut: ["G", "R"],
        icon: <CalendarDays size={14} />,
        group: "Navigation",
        keywords: "weekly stats progress history solved",
    },
    {
        id: "settings",
        label: "Settings",
        description: "Account & integrations",
        href: "/settings",
        shortcut: ["G", "S"],
        icon: <Settings size={14} />,
        group: "Navigation",
        keywords: "account leetcode sync username preferences",
    },
]

// ── Helpers ───────────────────────────────────────────────────

function isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false
    const tag = target.tagName
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true
    if (target.isContentEditable) return true
    if (target.closest("[contenteditable='true']")) return true
    return false
}

function filterCommands(commands: Command[], query: string): Command[] {
    if (!query.trim()) return commands
    const q = query.toLowerCase()
    return commands.filter((cmd) =>
        [cmd.label, cmd.description ?? "", cmd.keywords ?? "", cmd.group]
            .join(" ")
            .toLowerCase()
            .includes(q)
    )
}

// ── Kbd badge ─────────────────────────────────────────────────

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5
                    rounded border border-zinc-700 bg-zinc-800/80
                    text-[10px] font-mono font-medium text-zinc-400 leading-none select-none">
            {children}
        </kbd>
    )
}

// ── Main component ────────────────────────────────────────────

export function AppKeybindings() {
    const router = useRouter()
    const pathname = usePathname()

    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [activeIndex, setActiveIndex] = useState(0)

    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const awaitingG = useRef(false)
    const gTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const filtered = useMemo(() => filterCommands(NAV_COMMANDS, query), [query])

    // Reset active index on filter change
    useEffect(() => { setActiveIndex(0) }, [filtered.length, query])

    // Focus input on open, reset on close
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 10)
        } else {
            setQuery("")
            setActiveIndex(0)
        }
    }, [open])

    // Keep active item in view
    useEffect(() => {
        if (!listRef.current) return
        const items = listRef.current.querySelectorAll("[data-cmd-item]")
        items[activeIndex]?.scrollIntoView({ block: "nearest" })
    }, [activeIndex])

    const closePalette = useCallback(() => setOpen(false), [])

    const runCommand = useCallback((cmd: Command) => {
        closePalette()
        if (cmd.href && cmd.href !== pathname) router.push(cmd.href)
    }, [pathname, router, closePalette])

    // Global keydown handler
    useEffect(() => {
        const clearG = () => {
            awaitingG.current = false
            if (gTimer.current) { clearTimeout(gTimer.current); gTimer.current = null }
        }

        const onKeyDown = (e: KeyboardEvent) => {
            // ⌘K / Ctrl+K
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                setOpen((v) => !v)
                clearG()
                return
            }

            // Escape
            if (e.key === "Escape") {
                if (open) { e.preventDefault(); closePalette() }
                clearG()
                return
            }

            // Palette open — arrow + enter navigation
            if (open) {
                if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
                } else if (e.key === "ArrowUp") {
                    e.preventDefault()
                    setActiveIndex((i) => Math.max(i - 1, 0))
                } else if (e.key === "Enter") {
                    e.preventDefault()
                    const cmd = filtered[activeIndex]
                    if (cmd) runCommand(cmd)
                }
                return
            }

            // Palette closed — G-then-key shortcuts
            if (isEditableTarget(e.target)) return
            if (e.metaKey || e.ctrlKey || e.altKey) return

            if (awaitingG.current) {
                const key = e.key.toLowerCase()
                const match = NAV_COMMANDS.find(
                    (c) => c.shortcut?.[1]?.toLowerCase() === key
                )
                clearG()
                if (!match?.href || match.href === pathname) return
                e.preventDefault()
                router.push(match.href)
                return
            }

            if (e.key.toLowerCase() === "g") {
                awaitingG.current = true
                gTimer.current = setTimeout(clearG, 1200)
            }
        }

        window.addEventListener("keydown", onKeyDown)
        return () => { clearG(); window.removeEventListener("keydown", onKeyDown) }
    }, [open, filtered, activeIndex, pathname, router, runCommand, closePalette])

    if (!open) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
                style={{ animation: "kpFadeIn 120ms ease forwards" }}
                onClick={closePalette}
            />

            {/* Palette panel */}
            <div
                className="fixed left-1/2 top-[18vh] z-50 w-full max-w-[560px] -translate-x-1/2 px-4"
                style={{ animation: "kpSlideDown 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
            >
                <div className="rounded-xl border border-zinc-700/50 bg-zinc-900
                        shadow-[0_32px_96px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.03)]
                        overflow-hidden">

                    {/* ── Search input ── */}
                    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800/80">
                        <Search size={14} className="shrink-0 text-zinc-500" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search pages…"
                            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600
                         outline-none caret-orange-400"
                            spellCheck={false}
                        />
                        {query ? (
                            <button
                                onClick={() => setQuery("")}
                                className="text-zinc-600 hover:text-zinc-400 transition-colors"
                            >
                                <X size={13} />
                            </button>
                        ) : (
                            <Kbd>Esc</Kbd>
                        )}
                    </div>

                    {/* ── Results ── */}
                    <div ref={listRef} className="max-h-[340px] overflow-y-auto overscroll-contain">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-2 text-zinc-700">
                                <Search size={20} />
                                <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
                            </div>
                        ) : (
                            <div className="py-2">
                                <p className="px-4 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                                    Navigation
                                </p>
                                {filtered.map((cmd, idx) => {
                                    const isActive = idx === activeIndex
                                    return (
                                        <button
                                            key={cmd.id}
                                            data-cmd-item
                                            onClick={() => runCommand(cmd)}
                                            onMouseEnter={() => setActiveIndex(idx)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 mx-1 py-2.5 rounded-lg text-left",
                                                "transition-all duration-75",
                                                isActive ? "bg-zinc-800" : "hover:bg-zinc-800/50"
                                            )}
                                            style={{ width: "calc(100% - 8px)" }}
                                        >
                                            {/* Icon */}
                                            <span className={cn(
                                                "flex items-center justify-center w-7 h-7 rounded-lg shrink-0",
                                                "border transition-colors duration-75",
                                                isActive
                                                    ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
                                                    : "bg-zinc-800/80 border-zinc-700/60 text-zinc-500"
                                            )}>
                                                {cmd.icon}
                                            </span>

                                            {/* Text */}
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "text-sm font-medium leading-none mb-0.5 transition-colors",
                                                    isActive ? "text-zinc-100" : "text-zinc-300"
                                                )}>
                                                    {cmd.label}
                                                </p>
                                                {cmd.description && (
                                                    <p className="text-[11px] text-zinc-600 truncate">{cmd.description}</p>
                                                )}
                                            </div>

                                            {/* Right side: enter hint OR shortcut badges */}
                                            <div className="flex items-center gap-1 shrink-0">
                                                {isActive ? (
                                                    <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                                                        <CornerDownLeft size={11} /> open
                                                    </span>
                                                ) : cmd.shortcut ? (
                                                    <span className="flex items-center gap-0.5">
                                                        {cmd.shortcut.map((k) => <Kbd key={k}>{k}</Kbd>)}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── Footer ── */}
                    <div className="flex items-center justify-between px-4 py-2.5
                          border-t border-zinc-800/80 bg-zinc-950/50">
                        <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                            <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
                            <span className="flex items-center gap-1"><Kbd>↵</Kbd> open</span>
                            <span className="hidden sm:flex items-center gap-1 text-zinc-700">
                                <Kbd>G</Kbd><span className="text-zinc-700 mx-0.5">then key</span><span>to jump</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-700">
                            <Keyboard size={10} />
                            <span>⌘K</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animations */}
            <style>{`
        @keyframes kpFadeIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes kpSlideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px) scale(0.96); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)      scale(1);   }
        }
      `}</style>
        </>
    )
}

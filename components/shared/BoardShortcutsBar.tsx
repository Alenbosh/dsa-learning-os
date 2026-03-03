"use client"

import { useState } from "react"
import { Keyboard, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

function Key({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5
                    rounded border border-zinc-300 dark:border-zinc-700
                    bg-zinc-100 dark:bg-zinc-800/80
                    text-[10px] font-mono font-semibold text-zinc-600 dark:text-zinc-400
                    leading-none select-none shadow-[0_1px_0_0] shadow-zinc-300 dark:shadow-zinc-700">
            {children}
        </kbd>
    )
}

interface Binding {
    keys: string[]
    label: string
}

const BINDINGS: Binding[] = [
    { keys: ["N"], label: "Add new" },
    { keys: ["↓", "↑"], label: "Navigate" },
    { keys: ["←", "→"], label: "Move column" },
    { keys: ["E"], label: "Edit selected" },
    { keys: ["1", "2", "3", "4"], label: "Jump to column" },
    { keys: ["Esc"], label: "Deselect" },
]

export function BoardShortcutsBar({ hasSelection }: { hasSelection: boolean }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] transition-all",
            "bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800",
            hasSelection && "border-orange-500/20 bg-orange-500/5 dark:bg-orange-500/5"
        )}>
            {/* Icon + label */}
            <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-500 shrink-0">
                <Keyboard size={12} />
                <span className="font-medium hidden sm:inline">Keyboard</span>
            </div>

            {/* Bindings — shown inline on wider screens, collapsible on small */}
            <div className="hidden md:flex items-center gap-4 flex-wrap flex-1">
                {BINDINGS.map((b) => (
                    <span key={b.label} className="flex items-center gap-1 text-zinc-500 dark:text-zinc-600">
                        <span className="flex items-center gap-0.5">
                            {b.keys.map((k) => <Key key={k}>{k}</Key>)}
                        </span>
                        <span className="ml-1 text-zinc-400 dark:text-zinc-600">{b.label}</span>
                    </span>
                ))}
            </div>

            {/* Mobile toggle */}
            <button
                className="md:hidden flex items-center gap-1 text-zinc-500 ml-auto"
                onClick={() => setExpanded((v) => !v)}
            >
                <span>Shortcuts</span>
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {/* Active selection indicator */}
            {hasSelection && (
                <span className="hidden md:flex items-center gap-1 ml-auto shrink-0 text-orange-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                    card selected
                </span>
            )}

            {/* Mobile expanded */}
            {expanded && (
                <div className="md:hidden absolute left-0 right-0 mt-1 top-full z-10
                        bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800
                        rounded-xl p-3 shadow-lg grid grid-cols-2 gap-2">
                    {BINDINGS.map((b) => (
                        <span key={b.label} className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-600">
                            <span className="flex items-center gap-0.5">
                                {b.keys.map((k) => <Key key={k}>{k}</Key>)}
                            </span>
                            <span className="text-zinc-400 dark:text-zinc-600">{b.label}</span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

"use client"

import { usePathname } from "next/navigation"

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
    "/": { title: "Home", desc: "Your learning overview" },
    "/leetcode": { title: "LeetCode Tracker", desc: "Problems, patterns & notes" },
    "/dsa": { title: "DSA Study Board", desc: "Topics, revision & resources" },
    "/techstack": { title: "Tech Stack", desc: "Your learning pipeline" },
    "/docs": { title: "Docs", desc: "Search and star documentation" },
    "/review": { title: "Weekly Review", desc: "Your progress by week" },
    "/settings": { title: "Settings", desc: "Account & integrations" },
}

function Kbd({ children }: { children: React.ReactNode }) {
    return (
        <kbd className="inline-flex items-center justify-center h-5 px-1.5 rounded
                        border border-zinc-300 dark:border-zinc-700
                        bg-zinc-100 dark:bg-zinc-800/80
                        text-[10px] font-mono font-medium">
            {children}
        </kbd>
    )
}

export function Topbar() {
    const pathname = usePathname()
    const isHome = pathname === "/"

    const key = Object.keys(PAGE_TITLES)
        .sort((a, b) => b.length - a.length)
        .find((k) => pathname === k || (k !== "/" && pathname.startsWith(k)))

    const meta = key ? PAGE_TITLES[key] : { title: "DSA Learning OS", desc: "" }

    return (
        <header className="h-14 shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/80
                       backdrop-blur-sm flex items-center justify-between px-6 pl-14 md:pl-6">
            <div>
                <h2 className="text-sm font-semibold">{meta.title}</h2>
                {meta.desc && <p className="text-[11px] text-zinc-600 dark:text-zinc-500">{meta.desc}</p>}
            </div>
            <div className="hidden md:flex items-center gap-3 text-[10px] text-zinc-500 dark:text-zinc-600">
                {/* / shortcut — only shown on home page */}
                {isHome && (
                    <span className="flex items-center gap-1.5">
                        <Kbd>/</Kbd>
                        <span>focus search</span>
                    </span>
                )}
                <span className="flex items-center gap-1.5">
                    <Kbd>⌘</Kbd><Kbd>K</Kbd>
                    <span>command palette</span>
                </span>
            </div>
        </header>
    )
}

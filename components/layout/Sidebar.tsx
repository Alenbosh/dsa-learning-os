"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import Image from "next/image"
import { useState } from "react"
import {
    LayoutDashboard, Code2, Brain, Layers,
    LogOut, ChevronRight, Settings, ExternalLink,
    ChevronDown, ChevronUp, Home, Menu, X, CalendarDays,
    Sun, Moon, BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AppLogo } from "@/components/shared/AppLogo"
import { useTheme } from "@/components/providers/ThemeProvider"

const NAV = [
    { href: "/", label: "Home", icon: Home },
    { href: "/leetcode", label: "LeetCode", icon: Code2 },
    { href: "/dsa", label: "DSA Board", icon: Brain },
    { href: "/techstack", label: "Tech Stack", icon: Layers },
    { href: "/docs", label: "Docs", icon: BookOpen },
    { href: "/review", label: "Weekly Review", icon: CalendarDays },
    { href: "/settings", label: "Settings", icon: Settings },
]

const EXTERNAL_LINKS = [
    { href: "https://leetcode.com", label: "LeetCode", icon: "🧩" },
    { href: "https://neetcode.io", label: "NeetCode", icon: "🎯" },
    { href: "https://visualgo.net", label: "VisuAlgo", icon: "📊" },
    { href: "https://bigocheatsheet.com", label: "Big-O Sheet", icon: "⚡" },
    { href: "https://github.com", label: "GitHub", icon: "🐙" },
]

function SidebarContent({ user, onClose }: { user: any; onClose?: () => void }) {
    const pathname = usePathname()
    const [externalOpen, setExternalOpen] = useState(true)
    const { theme, toggle } = useTheme()

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-zinc-200 dark:border-zinc-800">
                <AppLogo size={28} />
                {onClose && (
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors md:hidden">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Main Nav */}
            <nav className="px-2 py-4 space-y-0.5">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 dark:text-zinc-500 px-3 pb-1.5">Navigation</p>
                {NAV.map(({ href, label, icon: Icon }) => {
                    const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                active
                                    ? "bg-orange-500/10 text-orange-400"
                                    : "text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/70"
                            )}
                        >
                            <Icon size={15} />
                            {label}
                            {active && <ChevronRight size={12} className="ml-auto opacity-50" />}
                        </Link>
                    )
                })}
            </nav>

            {/* External Links — collapsible */}
            <div className="px-2 pb-4">
                <button
                    onClick={() => setExternalOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-widest text-zinc-600 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-400 transition-colors"
                >
                    <span>Quick Links</span>
                    {externalOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                </button>

                {externalOpen && (
                    <div className="mt-1 space-y-0.5">
                        {EXTERNAL_LINKS.map(({ href, label, icon }) => (
                            <a
                                key={href}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-all group"
                            >
                                <span className="text-base leading-none">{icon}</span>
                                <span className="flex-1">{label}</span>
                                <ExternalLink size={11} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* User */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 p-3">
                <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
                    {user?.image ? (
                        <Image
                            src={user.image}
                            alt={user.name || ""}
                            width={28}
                            height={28}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{user?.name}</div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-600 truncate">{user?.email}</div>
                    </div>
                    <button
                        onClick={toggle}
                        className="p-1 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
                        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
                    </button>
                    <button
                        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                        className="p-1 text-zinc-600 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
                        title="Sign out"
                    >
                        <LogOut size={13} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export function Sidebar({ user }: { user: any }) {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <>
            {/* Mobile hamburger — shown in topbar area */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-3.5 left-4 z-50 p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
                aria-label="Open menu"
            >
                <Menu size={20} />
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <aside
                className={cn(
                    "md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-transform duration-300 ease-in-out",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <SidebarContent user={user} onClose={() => setMobileOpen(false)} />
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 h-screen">
                <SidebarContent user={user} />
            </aside>
        </>
    )
}

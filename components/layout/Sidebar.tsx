"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import Image from "next/image"
import {
    LayoutDashboard, Code2, Brain, Layers,
    LogOut, ChevronRight, Settings, Home,
    Menu, X, ExternalLink, ChevronDown, ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
    { href: "/", label: "Home", icon: Home },
    { href: "/leetcode", label: "LeetCode", icon: Code2 },
    { href: "/dsa", label: "DSA Board", icon: Brain },
    { href: "/techstack", label: "Tech Stack", icon: Layers },
    { href: "/settings", label: "Settings", icon: Settings },
]

const EXTERNAL_LINKS = [
    { href: "https://leetcode.com", label: "LeetCode", icon: Code2 },
    { href: "https://neetcode.io", label: "NeetCode", icon: Brain },
    { href: "https://roadmap.sh", label: "Roadmap.sh", icon: LayoutDashboard },
    { href: "https://visualgo.net", label: "VisuAlgo", icon: Layers },
]

function SidebarContent({ user, onClose }: { user: any; onClose?: () => void }) {
    const pathname = usePathname()
    const [externalOpen, setExternalOpen] = useState(false)

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between gap-2.5 px-4 py-5 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center shrink-0">
                        <Code2 size={14} className="text-white" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">DSA Learning OS</span>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors md:hidden"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
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
                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/70"
                            )}
                        >
                            <Icon size={15} />
                            {label}
                            {active && <ChevronRight size={12} className="ml-auto opacity-50" />}
                        </Link>
                    )
                })}

                {/* External Resources Section */}
                <div className="pt-2">
                    <button
                        onClick={() => setExternalOpen((v) => !v)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/70 transition-all"
                    >
                        <ExternalLink size={15} />
                        <span>Resources</span>
                        <span className="ml-auto">
                            {externalOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </span>
                    </button>

                    {externalOpen && (
                        <div className="mt-0.5 pl-2 space-y-0.5">
                            {EXTERNAL_LINKS.map(({ href, label, icon: Icon }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800/70 transition-all"
                                >
                                    <Icon size={13} />
                                    {label}
                                    <ExternalLink size={10} className="ml-auto opacity-40" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {/* User */}
            <div className="border-t border-zinc-800 p-3">
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
                        <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{user?.name}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{user?.email}</div>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                        className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors"
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
    const pathname = usePathname()

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-3.5 left-4 z-50 p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all md:hidden"
                aria-label="Open menu"
            >
                <Menu size={18} />
            </button>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile sidebar (slide in from left) */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 transition-transform duration-300 ease-in-out md:hidden",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <SidebarContent user={user} onClose={() => setMobileOpen(false)} />
            </aside>

            {/* Desktop sidebar (always visible) */}
            <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
                <SidebarContent user={user} />
            </aside>
        </>
    )
}

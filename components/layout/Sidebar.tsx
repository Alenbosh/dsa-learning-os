"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import Image from "next/image"
import {
  LayoutDashboard, Code2, Brain, Layers,
  LogOut, ChevronRight, Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leetcode", label: "LeetCode", icon: Code2 },
  { href: "/dsa", label: "DSA Board", icon: Brain },
  { href: "/techstack", label: "Tech Stack", icon: Layers },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-zinc-800">
        <div className="w-7 h-7 bg-orange-500 rounded-md flex items-center justify-center shrink-0">
          <Code2 size={14} className="text-white" />
        </div>
        <span className="font-bold text-sm tracking-tight">DSA Learning OS</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
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
    </aside>
  )
}

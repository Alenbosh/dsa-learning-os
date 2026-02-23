"use client"

import { usePathname } from "next/navigation"

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
  "/": { title: "Dashboard", desc: "Your learning overview" },
  "/leetcode": { title: "LeetCode Tracker", desc: "Problems, patterns & notes" },
  "/dsa": { title: "DSA Study Board", desc: "Topics, revision & resources" },
  "/techstack": { title: "Tech Stack", desc: "Your learning pipeline" },
  "/settings": { title: "Settings", desc: "Account & integrations" },
}

export function Topbar() {
  const pathname = usePathname()

  // Match dynamic routes
  const key = Object.keys(PAGE_TITLES)
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname === k || (k !== "/" && pathname.startsWith(k)))

  const meta = key ? PAGE_TITLES[key] : { title: "DSA Learning OS", desc: "" }

  return (
    <header className="h-14 shrink-0 border-b border-zinc-800 bg-zinc-950/80
                       backdrop-blur-sm flex items-center px-6">
      <div>
        <h2 className="text-sm font-semibold">{meta.title}</h2>
        {meta.desc && <p className="text-[11px] text-zinc-500">{meta.desc}</p>}
      </div>
    </header>
  )
}

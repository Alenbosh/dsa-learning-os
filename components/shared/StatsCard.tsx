import Link from "next/link"
import { cn } from "@/lib/utils"

const COLOR_MAP = {
  orange: "text-orange-400 bg-orange-400/10",
  green: "text-emerald-400 bg-emerald-400/10",
  amber: "text-amber-400 bg-amber-400/10",
  blue: "text-blue-400 bg-blue-400/10",
  purple: "text-purple-400 bg-purple-400/10",
  zinc: "text-zinc-400 bg-zinc-400/10",
} as const

type Color = keyof typeof COLOR_MAP

interface StatsCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  sub?: string
  color?: Color
  href?: string
}

export function StatsCard({ label, value, icon, sub, color = "zinc", href }: StatsCardProps) {
  const Wrapper = href ? Link : "div"

  return (
    <Wrapper
      href={href as string}
      className={cn(
        "group p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl",
        href && "hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-150 cursor-pointer"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-600 dark:text-zinc-500 font-medium">{label}</span>
        <div className={cn("p-1.5 rounded-md", COLOR_MAP[color])}>{icon}</div>
      </div>
      <div className="text-2xl font-bold tracking-tight font-mono">{value}</div>
      {sub && <div className="text-[11px] text-zinc-600 dark:text-zinc-500 mt-1">{sub}</div>}
    </Wrapper>
  )
}

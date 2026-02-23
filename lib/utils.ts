import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { differenceInCalendarDays, format, parseISO, subDays } from "date-fns"
import type { ProblemWithTags } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—"
  const d = typeof date === "string" ? parseISO(date) : date
  return format(d, "MMM d, yyyy")
}

export function calculateStreak(problems: ProblemWithTags[]): number {
  if (!problems.length) return 0

  const dates = [
    ...new Set(
      problems
        .filter((p) => p.date)
        .map((p) => format(new Date(p.date!), "yyyy-MM-dd"))
    ),
  ].sort((a, b) => b.localeCompare(a))

  if (!dates.length) return 0

  const today = format(new Date(), "yyyy-MM-dd")
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd")

  if (dates[0] !== today && dates[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < dates.length; i++) {
    const diff = differenceInCalendarDays(
      parseISO(dates[i - 1]),
      parseISO(dates[i])
    )
    if (diff === 1) streak++
    else break
  }
  return streak
}

export const DIFFICULTY_COLORS = {
  Easy: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Hard: "text-rose-400 bg-rose-400/10 border-rose-400/20",
} as const

export const STATUS_COLORS = {
  NotStarted: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  InProgress: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  NeedsRevision: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  Done: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
} as const

export const STAGE_LABELS = {
  WantToLearn: "Want to Learn",
  CurrentlyLearning: "Currently Learning",
  BuildingWith: "Building With",
  Comfortable: "Comfortable",
} as const

export const ALL_TAGS = [
  "Array", "HashMap", "Sliding Window", "DP", "Binary Search",
  "Graph", "Tree", "Stack", "Greedy", "Bit Manipulation",
  "Backtracking", "Math", "Heap", "Prefix Sum", "Two Pointers",
  "BFS", "DFS", "Trie", "Union Find", "Monotonic Stack",
  "String", "Recursion", "Sorting", "Linked List",
] as const

export const DSA_TOPICS = [
  "Arrays & Strings", "HashMaps & Sets", "Two Pointers",
  "Sliding Window", "Prefix Sum", "Stack & Queue",
  "Binary Search", "Linked Lists", "Trees & BST",
  "Graphs & BFS/DFS", "Dynamic Programming", "Greedy",
  "Backtracking", "Heaps & Priority Queue", "Tries",
  "Union Find", "Bit Manipulation", "Math & Number Theory",
] as const

export const TECH_CATEGORIES = [
  "Frontend", "Backend", "Database", "DevOps",
  "Mobile", "ML/AI", "Tools", "Language",
] as const

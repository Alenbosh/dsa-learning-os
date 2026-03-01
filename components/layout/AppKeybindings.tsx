"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import toast from "react-hot-toast"

const NAV_SHORTCUTS = [
    { key: "h", label: "Home", href: "/" },
    { key: "l", label: "LeetCode", href: "/leetcode" },
    { key: "d", label: "DSA Board", href: "/dsa" },
    { key: "t", label: "Tech Stack", href: "/techstack" },
    { key: "o", label: "Docs", href: "/docs" },
    { key: "r", label: "Weekly Review", href: "/review" },
    { key: "s", label: "Settings", href: "/settings" },
] as const

const SHORTCUT_TO_ROUTE: Record<string, (typeof NAV_SHORTCUTS)[number]> = NAV_SHORTCUTS.reduce(
    (acc, item) => {
        acc[item.key] = item
        return acc
    },
    {} as Record<string, (typeof NAV_SHORTCUTS)[number]>
)
const SHORTCUTS_TOAST_ID = "app-shortcuts-help"

function isEditableTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false

    const tag = target.tagName
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true
    if (target.isContentEditable) return true
    if (target.closest("[contenteditable='true']")) return true
    if (target.closest("[role='textbox']")) return true

    return false
}

function showShortcutHelp() {
    toast.dismiss(SHORTCUTS_TOAST_ID)
    toast(
        (
            <div className="space-y-1">
                <p className="font-semibold">Navigation shortcuts</p>
                <p className="text-xs">Press `g` then one of:</p>
                <p className="text-xs">h Home, l LeetCode, d DSA, t Tech, o Docs, r Review, s Settings</p>
            </div>
        ),
        { id: SHORTCUTS_TOAST_ID, duration: 5000 }
    )
}

export function AppKeybindings() {
    const router = useRouter()
    const pathname = usePathname()
    const awaitingSecondKey = useRef(false)
    const timerRef = useRef<number | null>(null)

    useEffect(() => {
        const clearPendingShortcut = () => {
            awaitingSecondKey.current = false
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current)
                timerRef.current = null
            }
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.defaultPrevented) return
            if (event.metaKey || event.ctrlKey || event.altKey) return
            if (isEditableTarget(event.target)) return

            if (event.key === "?") {
                event.preventDefault()
                showShortcutHelp()
                clearPendingShortcut()
                return
            }

            if (awaitingSecondKey.current) {
                const match = SHORTCUT_TO_ROUTE[event.key.toLowerCase()]
                clearPendingShortcut()
                if (!match) return
                if (pathname === match.href) return
                event.preventDefault()
                router.push(match.href)
                return
            }

            if (event.key.toLowerCase() === "g") {
                awaitingSecondKey.current = true
                timerRef.current = window.setTimeout(clearPendingShortcut, 1200)
            }
        }

        window.addEventListener("keydown", onKeyDown)
        return () => {
            clearPendingShortcut()
            window.removeEventListener("keydown", onKeyDown)
        }
    }, [pathname, router])

    return null
}

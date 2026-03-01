"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

const ThemeContext = createContext<{
    theme: Theme
    toggle: () => void
}>({ theme: "dark", toggle: () => { } })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark")

    useEffect(() => {
        const stored = localStorage.getItem("theme")
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        const resolved: Theme = stored === "light" || stored === "dark"
            ? stored
            : (prefersDark ? "dark" : "light")
        setTheme(resolved)
        document.documentElement.classList.toggle("dark", resolved === "dark")
        document.documentElement.classList.toggle("light", resolved === "light")
    }, [])

    function toggle() {
        setTheme((prev) => {
            const next = prev === "dark" ? "light" : "dark"
            localStorage.setItem("theme", next)
            document.documentElement.classList.toggle("dark", next === "dark")
            document.documentElement.classList.toggle("light", next === "light")
            return next
        })
    }

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)

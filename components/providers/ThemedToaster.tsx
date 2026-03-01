"use client"

import { Toaster } from "react-hot-toast"
import { useTheme } from "@/components/providers/ThemeProvider"

export function ThemedToaster() {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: isDark ? "#18181b" : "#ffffff",
                    color: isDark ? "#f4f4f5" : "#18181b",
                    border: `1px solid ${isDark ? "#27272a" : "#e4e4e7"}`,
                    fontFamily: "var(--font-inter)",
                    fontSize: "13px",
                },
            }}
        />
    )
}

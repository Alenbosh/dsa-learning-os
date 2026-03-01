import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { getServerSession } from "next-auth"
import Script from "next/script"
import { authOptions } from "@/lib/auth"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { ThemedToaster } from "@/components/providers/ThemedToaster"
import "./globals.css"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

export const metadata: Metadata = {
    title: "DSA Learning OS",
    description: "Track LeetCode, DSA topics, and your tech stack journey",
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
                <Script id="theme-init" strategy="beforeInteractive">
                    {`(() => {
                        const stored = localStorage.getItem("theme");
                        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                        const resolved = stored === "light" || stored === "dark" ? stored : (prefersDark ? "dark" : "light");
                        document.documentElement.classList.toggle("dark", resolved === "dark");
                        document.documentElement.classList.toggle("light", resolved === "light");
                    })();`}
                </Script>
                <ThemeProvider>
                    <SessionProvider session={session}>
                        {children}
                        <ThemedToaster />
                    </SessionProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

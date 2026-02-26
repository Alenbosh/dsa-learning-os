import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SessionProvider } from "@/components/providers/SessionProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Toaster } from "react-hot-toast"
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
        <html lang="en" className="dark">
            <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
                <ThemeProvider>
                    <SessionProvider session={session}>
                        {children}
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                style: {
                                    background: "#18181b",
                                    color: "#f4f4f5",
                                    border: "1px solid #27272a",
                                    fontFamily: "var(--font-inter)",
                                    fontSize: "13px",
                                },
                            }}
                        />
                    </SessionProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

import { cn } from "@/lib/utils"

interface AppLogoProps {
    size?: number       // px size of the icon mark
    showText?: boolean  // whether to show "DSA Learning OS" wordmark
    className?: string
}

/**
 * AppLogo — the DSA Learning OS brand mark.
 *
 * The icon: two bracket arms [ ] with a connected node in the centre.
 * Brackets reference code syntax; the node references a graph/data structure node.
 * Together they read as "structured algorithms", which is exactly what the app is.
 *
 * Usage:
 *   <AppLogo />                    — 32px icon + wordmark
 *   <AppLogo showText={false} />   — icon only (e.g. favicon, mobile)
 *   <AppLogo size={40} />          — larger version
 */
export function AppLogo({ size = 32, showText = true, className }: AppLogoProps) {
    const r = size / 32  // scale ratio

    return (
        <div className={cn("flex items-center gap-2.5 shrink-0 select-none", className)}>
            {/* ── Icon mark ── */}
            <svg
                width={size}
                height={size}
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                {/* Background */}
                <rect width="32" height="32" rx={8 * r} fill="#ea580c" />

                {/* Left bracket */}
                <path d="M9 10 L9 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M9 10 L12 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M9 22 L12 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

                {/* Right bracket */}
                <path d="M23 10 L23 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M23 10 L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M23 22 L20 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />

                {/* Centre node */}
                <circle cx="16" cy="16" r="2.5" fill="white" />
                {/* Connecting line through node */}
                <path d="M13 16 L19 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>

            {/* ── Wordmark ── */}
            {showText && (
                <span className="font-bold text-sm tracking-tight leading-none">
                    DSA Learning OS
                </span>
            )}
        </div>
    )
}

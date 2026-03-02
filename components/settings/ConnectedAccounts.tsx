"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import {
    CheckCircle2, Link2, Link2Off, Loader2,
    ShieldCheck, AlertTriangle
} from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

// ── Provider config ───────────────────────────────────────────

interface ProviderConfig {
    id: "github" | "google"
    name: string
    icon: React.ReactNode
    accentClass: string
    badgeClass: string
}

const PROVIDERS: ProviderConfig[] = [
    {
        id: "github",
        name: "GitHub",
        accentClass: "text-zinc-200 border-zinc-600 bg-zinc-800",
        badgeClass: "bg-zinc-800 text-zinc-300 border-zinc-700",
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
        ),
    },
    {
        id: "google",
        name: "Google",
        accentClass: "text-white border-blue-600/40 bg-blue-600/10",
        badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
        ),
    },
]

interface LinkedAccount {
    provider: string
    createdAt: string
}

interface Props {
    linkedAccounts: LinkedAccount[]       // server-fetched initial state
    availableProviders: string[]          // providers configured in next-auth
}

export function ConnectedAccounts({ linkedAccounts: initial, availableProviders }: Props) {
    const [linked, setLinked] = useState<LinkedAccount[]>(initial)
    const [loading, setLoading] = useState<string | null>(null)

    const linkedProviderIds = new Set(linked.map((a) => a.provider))
    const isOnlyOne = linked.length === 1

    // ── Connect: trigger signIn while already authenticated ──────
    async function connect(providerId: string) {
        setLoading(providerId)
        try {
            // signIn with redirect:false first — NextAuth will detect the existing
            // session and link the new provider to the current user via PrismaAdapter
            await signIn(providerId, {
                callbackUrl: "/settings?linked=" + providerId,
                redirect: true,
            })
            // Page will reload after OAuth — no further action needed here
        } catch {
            toast.error("Failed to connect " + providerId)
            setLoading(null)
        }
    }

    // ── Disconnect ───────────────────────────────────────────────
    async function disconnect(providerId: string) {
        if (isOnlyOne) {
            toast.error("Can't remove your only sign-in method")
            return
        }
        if (!confirm(`Disconnect ${providerId}? You can reconnect it any time.`)) return

        setLoading(providerId)
        try {
            const res = await fetch(`/api/auth/link-provider?provider=${providerId}`, {
                method: "DELETE",
            })
            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error ?? "Failed to disconnect")
                return
            }

            setLinked((prev) => prev.filter((a) => a.provider !== providerId))
            toast.success(`${providerId} disconnected`)
        } catch {
            toast.error("Something went wrong")
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                    <ShieldCheck size={15} className="text-blue-400" />
                </div>
                <div>
                    <h2 className="font-semibold text-sm">Connected Accounts</h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-500">
                        Sign in with any connected provider
                    </p>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {/* Security note */}
                <div className="flex items-start gap-2.5 p-3 bg-blue-500/5 border border-blue-500/15 rounded-lg">
                    <ShieldCheck size={13} className="text-blue-400 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-500 leading-relaxed">
                        Connecting a provider while logged in safely links it to your existing account.
                        All your data — problems, topics, tech stack — stays intact.
                    </p>
                </div>

                {/* Provider rows */}
                <div className="space-y-2.5">
                    {PROVIDERS.filter((p) => availableProviders.includes(p.id)).map((provider) => {
                        const isLinked = linkedProviderIds.has(provider.id)
                        const isLoading = loading === provider.id
                        const canUnlink = isLinked && !isOnlyOne

                        return (
                            <div
                                key={provider.id}
                                className={cn(
                                    "flex items-center gap-3 p-3.5 rounded-xl border transition-all",
                                    isLinked
                                        ? "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700"
                                        : "bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/70 dark:border-zinc-800/50"
                                )}
                            >
                                {/* Provider icon */}
                                <div className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-lg border shrink-0",
                                    provider.accentClass
                                )}>
                                    {provider.icon}
                                </div>

                                {/* Name + status */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{provider.name}</span>
                                        {isLinked && (
                                            <span className={cn(
                                                "text-[10px] font-semibold px-1.5 py-0.5 rounded border",
                                                provider.badgeClass
                                            )}>
                                                Connected
                                            </span>
                                        )}
                                        {isLinked && isOnlyOne && (
                                            <span className="text-[10px] text-amber-500 flex items-center gap-1">
                                                <AlertTriangle size={10} /> only method
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-600 mt-0.5">
                                        {isLinked
                                            ? `You can sign in with ${provider.name}`
                                            : `Connect to sign in with ${provider.name}`}
                                    </p>
                                </div>

                                {/* Action button */}
                                {isLinked ? (
                                    <button
                                        onClick={() => disconnect(provider.id)}
                                        disabled={isLoading || !canUnlink}
                                        title={!canUnlink ? "Can't remove your only sign-in method" : undefined}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium",
                                            "border transition-all disabled:opacity-40 disabled:cursor-not-allowed",
                                            canUnlink
                                                ? "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-rose-400/50 hover:text-rose-400 hover:bg-rose-500/5"
                                                : "border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600"
                                        )}
                                    >
                                        {isLoading
                                            ? <Loader2 size={11} className="animate-spin" />
                                            : <Link2Off size={11} />}
                                        {isLoading ? "..." : "Disconnect"}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => connect(provider.id)}
                                        disabled={isLoading !== null}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                               bg-orange-500 hover:bg-orange-400 text-white
                               border border-orange-600 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading
                                            ? <Loader2 size={11} className="animate-spin" />
                                            : <Link2 size={11} />}
                                        {isLoading ? "Connecting…" : "Connect"}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* "Linked accounts" count summary */}
                <div className="flex items-center gap-2 pt-1">
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-600">
                        {linked.length} provider{linked.length !== 1 ? "s" : ""} connected
                        {isOnlyOne && " — connect another to enable sign-in flexibility"}
                    </p>
                </div>
            </div>
        </div>
    )
}

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { LeetCodeSyncClient } from "@/components/settings/LeetCodeSyncClient"
import { ConnectedAccounts } from "@/components/settings/ConnectedAccounts"

export default async function SettingsPage() {
    const session = await getServerSession(authOptions)
    const userId = (session!.user as any).id

    const [user, linkedAccounts] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true, image: true, leetcodeUsername: true },
        }),
        prisma.account.findMany({
            where: { userId },
            select: { provider: true, createdAt: true },
            orderBy: { createdAt: "asc" },
        }),
    ])

    // Which providers are actually configured in NextAuth
    const availableProviders = authOptions.providers.map((p: any) => p.id as string)

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-500 mt-1">
                    Manage your account and integrations
                </p>
            </div>

            {/* Account info */}
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
                <h2 className="font-semibold text-sm mb-4">Account</h2>
                <div className="flex items-center gap-3">
                    {user?.image && (
                        <img src={user.image} alt="" className="w-10 h-10 rounded-full" />
                    )}
                    <div>
                        <div className="text-sm font-medium">{user?.name}</div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-500">{user?.email}</div>
                    </div>
                </div>
            </div>

            {/* Connected providers — the safe account-linking section */}
            <ConnectedAccounts
                linkedAccounts={linkedAccounts.map((a) => ({
                    provider: a.provider,
                    createdAt: a.createdAt.toISOString(),
                }))}
                availableProviders={availableProviders}
            />

            {/* LeetCode sync */}
            <LeetCodeSyncClient user={user} />
        </div>
    )
}

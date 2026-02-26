import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { LeetCodeSyncClient } from "@/components/settings/LeetCodeSyncClient"

export default async function SettingsPage() {
    const session = await getServerSession(authOptions)
    const userId = (session!.user as any).id

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, image: true, leetcodeUsername: true },
    })

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-500 mt-1">Manage your account and integrations</p>
            </div>
            <LeetCodeSyncClient user={user} />
        </div>
    )
}

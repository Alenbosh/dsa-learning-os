import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { LeetCodeSyncClient } from "@/components/settings/LeetCodeSyncClient"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your account and integrations</p>
      </div>

      <LeetCodeSyncClient user={session!.user} />
    </div>
  )
}

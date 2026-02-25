import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { WeeklyReviewClient } from "@/components/review/WeeklyReviewClient"

export default async function WeeklyReviewPage() {
    const session = await getServerSession(authOptions)
    return <WeeklyReviewClient user={session!.user} />
}

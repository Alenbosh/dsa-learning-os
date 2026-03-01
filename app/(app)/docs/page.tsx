import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DocsClient } from "@/components/docs/DocsClient"

export default async function DocsPage() {
    const session = await getServerSession(authOptions)
    const userId = (session!.user as any).id

    // Fetch user's saved bookmarks server-side so the page hydrates instantly
    const bookmarks = await prisma.docBookmark.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    })

    return (
        <DocsClient
            initialBookmarks={bookmarks.map((b) => ({
                ...b,
                createdAt: b.createdAt.toISOString(),
                updatedAt: b.updatedAt.toISOString(),
            }))}
        />
    )
}

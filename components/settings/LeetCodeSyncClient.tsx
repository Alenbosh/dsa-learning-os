"use client"

import { useState } from "react"
import { Search, Download, CheckCircle2, XCircle, Loader2, ExternalLink, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

interface LCStats {
  username: string
  stats: { easy: number; medium: number; hard: number; total: number }
}

export function LeetCodeSyncClient({ user }: { user: any }) {
  const [username, setUsername] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState<LCStats | null>(null)
  const [verifyError, setVerifyError] = useState("")
  const [importing, setImporting] = useState(false)
  const [importLimit, setImportLimit] = useState(20)
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; message: string } | null>(null)

  async function verifyUsername() {
    if (!username.trim()) return
    setVerifying(true)
    setVerified(null)
    setVerifyError("")
    setImportResult(null)

    try {
      const res = await fetch(`/api/leetcode-sync?username=${encodeURIComponent(username.trim())}`)
      const data = await res.json()

      if (!res.ok) {
        setVerifyError(data.error ?? "Failed to verify username")
        return
      }

      setVerified(data)
    } catch {
      setVerifyError("Could not reach LeetCode. Try again.")
    } finally {
      setVerifying(false)
    }
  }

  async function importProblems() {
    if (!verified) return
    setImporting(true)
    setImportResult(null)

    const toastId = toast.loading(`Importing last ${importLimit} solved problems...`)

    try {
      const res = await fetch("/api/leetcode-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: verified.username, limit: importLimit }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? "Import failed", { id: toastId })
        return
      }

      setImportResult(data)
      toast.success(data.message, { id: toastId })
    } catch {
      toast.error("Import failed. Try again.", { id: toastId })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* LeetCode Sync Card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
          <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center">
            <span className="text-sm">🔗</span>
          </div>
          <div>
            <h2 className="font-semibold text-sm">LeetCode Sync</h2>
            <p className="text-xs text-zinc-500">Import your solved problems automatically</p>
          </div>
          <a
            href="https://leetcode.com"
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <ExternalLink size={13} />
          </a>
        </div>

        <div className="p-5 space-y-5">
          {/* How it works */}
          <div className="bg-zinc-950/50 border border-zinc-800/50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-semibold text-zinc-400">How it works</p>
            <ul className="text-xs text-zinc-500 space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">1.</span>
                Enter your public LeetCode username
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">2.</span>
                We fetch your recent accepted submissions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">3.</span>
                Problems are added to your tracker with difficulty + tags pre-filled
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">4.</span>
                You add notes, patterns, and mistakes manually
              </li>
            </ul>
          </div>

          {/* Username input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              LeetCode Username
            </label>
            <div className="flex gap-2">
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setVerified(null)
                  setVerifyError("")
                }}
                onKeyDown={(e) => e.key === "Enter" && verifyUsername()}
                placeholder="e.g. neal_wu"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2
                           text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600
                           transition-colors"
              />
              <button
                onClick={verifyUsername}
                disabled={verifying || !username.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700
                           text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {verifying
                  ? <Loader2 size={13} className="animate-spin" />
                  : <Search size={13} />
                }
                Verify
              </button>
            </div>

            {/* Verify error */}
            {verifyError && (
              <div className="flex items-center gap-2 text-xs text-rose-400">
                <XCircle size={13} />
                {verifyError}
              </div>
            )}
          </div>

          {/* Verified user stats */}
          {verified && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">
                  Found: {verified.username}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Total", value: verified.stats.total, color: "text-zinc-300" },
                  { label: "Easy", value: verified.stats.easy, color: "text-emerald-400" },
                  { label: "Medium", value: verified.stats.medium, color: "text-amber-400" },
                  { label: "Hard", value: verified.stats.hard, color: "text-rose-400" },
                ].map((s) => (
                  <div key={s.label} className="bg-zinc-900 rounded-lg p-2.5 text-center">
                    <div className={cn("text-lg font-bold font-mono", s.color)}>{s.value}</div>
                    <div className="text-[10px] text-zinc-600">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Import controls */}
              <div className="pt-1 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Problems to import
                  </label>
                  <span className="text-xs text-zinc-500 font-mono">last {importLimit}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={importLimit}
                  onChange={(e) => setImportLimit(parseInt(e.target.value))}
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-600">
                  <span>5</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>

                <button
                  onClick={importProblems}
                  disabled={importing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500
                             hover:bg-orange-400 text-white text-sm font-semibold rounded-lg
                             transition-colors disabled:opacity-50"
                >
                  {importing
                    ? <><Loader2 size={13} className="animate-spin" /> Importing...</>
                    : <><Download size={13} /> Import {importLimit} Problems</>
                  }
                </button>
              </div>
            </div>
          )}

          {/* Import result */}
          {importResult && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-400" />
                <span className="text-sm font-semibold text-blue-400">Import Complete</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold font-mono text-emerald-400">{importResult.imported}</div>
                  <div className="text-[10px] text-zinc-600">New problems added</div>
                </div>
                <div className="bg-zinc-900 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold font-mono text-zinc-500">{importResult.skipped}</div>
                  <div className="text-[10px] text-zinc-600">Already existed</div>
                </div>
              </div>
              <p className="text-xs text-zinc-500 text-center pt-1">
                Go to your{" "}
                <a href="/leetcode" className="text-orange-400 hover:text-orange-300 transition-colors">
                  LeetCode tracker
                </a>
                {" "}to add notes and patterns
              </p>
            </div>
          )}

          {/* Note about limitations */}
          <p className="text-[11px] text-zinc-600 leading-relaxed">
            ⚠️ LeetCode doesn't have an official API. This uses their public GraphQL endpoint
            which only returns accepted submissions. Time taken, attempts, and notes must be
            added manually. Your username must be public on LeetCode.
          </p>
        </div>
      </div>

      {/* Account info card */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h2 className="font-semibold text-sm mb-4">Account</h2>
        <div className="flex items-center gap-3">
          {user?.image && (
            <img src={user.image} alt="" className="w-10 h-10 rounded-full" />
          )}
          <div>
            <div className="text-sm font-medium">{user?.name}</div>
            <div className="text-xs text-zinc-500">{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

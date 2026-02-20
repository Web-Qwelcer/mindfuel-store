import type { ReactNode } from "react"
import Link from "next/link"

/**
 * TODO:
 * In the future, add auth guard here (middleware or server session check).
 */

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Admin Panel
          </h1>

          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white transition"
          >
            ← Back to Store
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
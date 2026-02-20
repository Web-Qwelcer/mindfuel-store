import type { Metadata } from "next"
import Link from "next/link"
import { CartProvider } from "./context/CartContext"
import CartLink from "./components/CartLink"
import "./globals.css"

export const metadata: Metadata = {
  title: "MindFuel Store",
  description: "Premium digital systems for focus and productivity",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased">
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <header className="border-b border-zinc-800">
              <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <Link
                    href="/"
                    className="text-xl font-semibold tracking-tight hover:opacity-80 transition"
                  >
                    MindFuel
                  </Link>

                  <nav className="flex gap-6 text-sm">
                    <Link
                      href="/"
                      className="text-zinc-400 hover:text-white transition"
                    >
                      Store
                    </Link>

                    <Link
                      href="/admin/orders"
                      className="text-zinc-400 hover:text-white transition"
                    >
                      Admin
                    </Link>
                  </nav>
                </div>

                <CartLink />
              </div>
            </header>

            <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
              {children}
            </main>

            <footer className="border-t border-zinc-800">
              <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-zinc-500">
                © {new Date().getFullYear()} MindFuel. All rights reserved.
              </div>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
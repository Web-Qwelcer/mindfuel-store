"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/app/context/CartContext"

export default function CartPage() {
  const router = useRouter()
  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    checkout,
  } = useCart()

  const [checkingOut, setCheckingOut] = useState(false)

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleCheckout = async () => {
    setCheckingOut(true)

    try {
      const id = await checkout()
      if (id) {
        router.push(`/success?id=${id}`)
      }
    } finally {
      setCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl space-y-6">
        <h2 className="text-2xl font-bold">Cart</h2>
        <p className="text-zinc-400">Your cart is empty.</p>
        <Link
          href="/"
          className="inline-block text-zinc-400 hover:text-white transition"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-2xl font-bold">Cart</h2>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="border border-zinc-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-zinc-400">
                ${item.price} × {item.quantity}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => decreaseQuantity(item.id)}
                className="w-8 h-8 rounded border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className="w-8 text-center tabular-nums">
                {item.quantity}
              </span>

              <button
                type="button"
                onClick={() => increaseQuantity(item.id)}
                className="w-8 h-8 rounded border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
                aria-label="Increase quantity"
              >
                +
              </button>

              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="ml-2 text-sm text-zinc-500 hover:text-red-400 transition"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-zinc-800 pt-4 flex justify-between items-center">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-xl font-bold">${totalPrice}</span>
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={checkingOut}
        className="w-full bg-white text-black py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
      >
        {checkingOut ? "Processing..." : "Checkout"}
      </button>
    </div>
  )
}
"use client"

import Link from "next/link"
import { useCart } from "../context/CartContext"

export default function CartLink() {
  const { items } = useCart()
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Link
      href="/cart"
      className="text-sm font-medium text-zinc-300 hover:text-white transition"
    >
      Cart ({totalQty})
    </Link>
  )
}

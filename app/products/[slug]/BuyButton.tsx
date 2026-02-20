"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/app/context/CartContext"

type Props = {
  productId: string
  productName: string
  productPrice: number
}

export default function BuyButton({
  productId,
  productName,
  productPrice,
}: Props) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) return
    const t = setTimeout(() => setAdded(false), 2000)
    return () => clearTimeout(t)
  }, [added])

  function handleAddToCart() {
    addToCart({
      id: productId,
      name: productName,
      price: productPrice,
    })
    setAdded(true)
  }

  return (
    <button
      onClick={handleAddToCart}
      className="bg-white text-black px-5 py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
    >
      {added ? "Added" : "Add to cart"}
    </button>
  )
}

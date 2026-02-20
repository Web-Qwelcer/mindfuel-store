"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"

type Props = {
  orderId: string
  status: "PENDING" | "PAID" | "CANCELLED"
}

export default function OrderActions({ orderId, status }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleAction = (action: "PAY" | "CANCEL") => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => null)
          console.error("Order update failed:", data?.error || res.status)
          return
        }

        router.refresh()
      } catch (error) {
        console.error("Network error while updating order:", error)
      }
    })
  }

  if (status !== "PENDING") {
    return <span className="text-zinc-600 text-xs">No actions</span>
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction("PAY")}
        disabled={isPending}
        className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 rounded disabled:opacity-50 transition"
      >
        Mark as Paid
      </button>

      <button
        onClick={() => handleAction("CANCEL")}
        disabled={isPending}
        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 rounded disabled:opacity-50 transition"
      >
        Cancel
      </button>
    </div>
  )
}
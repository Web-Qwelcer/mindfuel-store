import { notFound } from "next/navigation"
import { OrderService } from "@/services/order.service"

export const dynamic = "force-dynamic"

type Props = {
  searchParams: Promise<{
    id?: string
  }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { id } = await searchParams

  if (!id) {
    return notFound()
  }

  const order = await OrderService.getOrderById(id)

  if (!order) {
    return notFound()
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Order Successful</h2>
        <p className="text-zinc-400">
          Order ID: <span className="font-mono">{order.id}</span>
        </p>
        <p className="text-zinc-400">
          Status: <span className="font-semibold">{order.status}</span>
        </p>
      </div>

      <div className="border border-zinc-800 rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold">Items</h3>

        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${item.price * item.quantity}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-zinc-800 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${order.total}</span>
        </div>
      </div>
    </div>
  )
}
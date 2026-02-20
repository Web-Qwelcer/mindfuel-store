import { notFound } from "next/navigation"
import Link from "next/link"
import { OrderService } from "@/services/order.service"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailsPage({ params }: Props) {
  const { id } = await params

  const order = await OrderService.getOrderById(id)

  if (!order) {
    return notFound()
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">Order Details</h2>
          <p className="text-zinc-400 text-sm mt-1">
            ID: <span className="font-mono">{order.id}</span>
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="text-sm text-zinc-400 hover:text-white transition"
        >
          ← Back to Orders
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="border border-zinc-800 rounded-xl p-5">
          <div className="text-sm text-zinc-400">Status</div>
          <div className="text-xl font-semibold mt-1">
            {order.status}
          </div>
        </div>

        <div className="border border-zinc-800 rounded-xl p-5">
          <div className="text-sm text-zinc-400">Total</div>
          <div className="text-xl font-semibold mt-1">
            ${order.total}
          </div>
        </div>

        <div className="border border-zinc-800 rounded-xl p-5">
          <div className="text-sm text-zinc-400">Created</div>
          <div className="text-xl font-semibold mt-1">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
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
      </div>
    </div>
  )
}
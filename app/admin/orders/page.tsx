import Link from "next/link"
import { OrderService } from "@/services/order.service"
import OrderActions from "./OrderActions"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const [orders, stats] = await Promise.all([
    OrderService.getAllOrders(),
    OrderService.getOrderStats(),
  ])

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Orders</h2>
        <p className="text-zinc-400 text-sm">
          Manage and update order statuses.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="border border-zinc-800 rounded-xl p-5">
          <div className="text-sm text-zinc-400">Total Orders</div>
          <div className="text-2xl font-bold mt-1">
            {stats.totalOrders}
          </div>
        </div>

        <div className="border border-zinc-800 rounded-xl p-5">
          <div className="text-sm text-zinc-400">Paid Orders</div>
          <div className="text-2xl font-bold mt-1 text-emerald-500">
            {stats.paidOrders}
          </div>
        </div>

        <div className="border border-zinc-800 rounded-xl p-5">
          <div className="text-sm text-zinc-400">Pending Orders</div>
          <div className="text-2xl font-bold mt-1 text-yellow-500">
            {stats.pendingOrders}
          </div>
        </div>

        <div className="border border-zinc-800 rounded-xl p-5">
          <div className="text-sm text-zinc-400">Total Revenue</div>
          <div className="text-2xl font-bold mt-1">
            ${stats.totalRevenue}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="text-zinc-500">No orders found.</div>
      ) : (
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900 border-b border-zinc-800">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Order ID</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-zinc-800 last:border-none"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="hover:underline"
                    >
                      {order.id}
                    </Link>
                  </td>

                  <td className="px-4 py-3">
                    {order.status}
                  </td>

                  <td className="px-4 py-3">
                    ${order.total}
                  </td>

                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 py-3">
                    <OrderActions
                      orderId={order.id}
                      status={order.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
import { NextResponse } from "next/server"
import { OrderService } from "@/services/order.service"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const order = await OrderService.getOrderById(id)

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  return NextResponse.json(order)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()
    const { action } = body

    if (!action || !["PAY", "CANCEL"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      )
    }

    if (action === "PAY") {
      const updated = await OrderService.markAsPaid(id)
      return NextResponse.json(updated)
    }

    if (action === "CANCEL") {
      const updated = await OrderService.cancelOrder(id)
      return NextResponse.json(updated)
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update order"

    return NextResponse.json(
      { error: message },
      { status: 400 }
    )
  }
}
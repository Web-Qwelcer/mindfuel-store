import { NextResponse } from "next/server"
import { z } from "zod"
import { OrderService } from "@/services/order.service"

const OrderItemSchema = z.object({
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
})

const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1),
})

export async function GET() {
  const orders = await OrderService.getAllOrders()
  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const parsed = CreateOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const order = await OrderService.createOrder(parsed.data)

    return NextResponse.json(order)
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}
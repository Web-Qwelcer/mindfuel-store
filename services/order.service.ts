// services/order.service.ts

import { prisma } from "@/lib/prisma"
import { OrderStatus } from "@prisma/client"

type CreateOrderInput = {
  items: {
    name: string
    price: number
    quantity: number
  }[]
}

export class OrderService {
  static async createOrder(input: CreateOrderInput) {
    if (!input.items || input.items.length === 0) {
      throw new Error("Order must contain at least one item")
    }

    const total = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          total,
          status: OrderStatus.PENDING,
          items: {
            create: input.items.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      })

      return order
    })
  }

  static async getOrderById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })
  }

  static async getAllOrders() {
    return prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    })
  }

  static async getOrderStats() {
    const [totalOrders, paidOrders, pendingOrders, paidRevenue] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.count({ where: { status: OrderStatus.PAID } }),
        prisma.order.count({ where: { status: OrderStatus.PENDING } }),
        prisma.order.aggregate({
          where: { status: OrderStatus.PAID },
          _sum: { total: true },
        }),
      ])

    return {
      totalOrders,
      paidOrders,
      pendingOrders,
      totalRevenue: paidRevenue._sum.total ?? 0,
    }
  }

  static async markAsPaid(id: string) {
    const order = await prisma.order.findUnique({ where: { id } })

    if (!order) {
      throw new Error("Order not found")
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error("Only PENDING orders can be marked as PAID")
    }

    return prisma.order.update({
      where: { id },
      data: { status: OrderStatus.PAID },
    })
  }

  static async cancelOrder(id: string) {
    const order = await prisma.order.findUnique({ where: { id } })

    if (!order) {
      throw new Error("Order not found")
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new Error("Only PENDING orders can be cancelled")
    }

    return prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    })
  }
}
import prisma from "../../database"
import type { CreatePaymentInput, UpdatePaymentInput } from "./payment.type"

export const PaymentRepository = {
  create(data: CreatePaymentInput) {
    return prisma.payment.create({ data })
  },

  findByOrderId(orderId: string) {
    return prisma.payment.findUnique({
      where: { orderId },
      include: { donation: true },
    })
  },

  updateByOrderId(orderId: string, data: UpdatePaymentInput) {
    return prisma.payment.update({
      where: { orderId },
      data,
    })
  },
}

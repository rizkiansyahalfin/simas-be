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

  markRefunded(
    orderId: string,
    data: {
      refundAmount: number,
      refundReason: string
    }
  ) {
    return prisma.payment.update({
      where: { orderId },
      data: {
        transactionStatus: "refunded",
        refundAmount: data.refundAmount,
        refundReason: data.refundReason,
        refundedAt: new Date(),
      },
    })
  },

  findPendingPayments() {
    return prisma.payment.findMany({
      where: {
        transactionStatus: "pending",
      },
    })
  },

  updateStatus(orderId: string, status: string) {
    return prisma.payment.update({
      where: { orderId },
      data: { transactionStatus: status },
    })
  },

  incrementRetry(paymentId: number) {
    return prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        retryCount: {
          increment: 1,
        },
        lastCheckedAt: new Date(),
      },
    })
  },

  markAlerted(paymentId: number) {
    return prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        alertedAt: new Date(),
      },
    })
  },

}

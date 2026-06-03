import crypto from "crypto"

import prisma from "../../database"
import { snap, midtransConfig } from "../../config/midtrans.config"

import type { SnapTransactionParameters } from "midtrans-client"
import { PaymentRepository } from "./payment.repository"
import type {
  CreateTransactionInput,
  MidtransWebhookPayload,
} from "./payment.type"

import { MailService } from "../mail/mail.service"
import { donationVerifiedTemplate } from "../mail/templates/donation-verified.template"
import { processRefund } from "./payment.utils"

const isSuccessTransactionStatus = (status: string) =>
  status === "settlement" || status === "capture"

const isFailedTransactionStatus = (status: string) =>
  ["deny", "cancel", "expire"].includes(status)

const buildSignature = (payload: MidtransWebhookPayload) =>
  crypto
    .createHash("sha512")
    .update(
      payload.order_id +
        payload.status_code +
        payload.gross_amount +
        midtransConfig.serverKey
    )
    .digest("hex")

const sendDonationVerifiedEmail = async (payment: {
  donorEmail: string
  donorName: string
  amount: number
}) => {
  await MailService.sendMail({
    to: payment.donorEmail,
    subject: "Donasi Berhasil",
    html: donationVerifiedTemplate({
      donorName: payment.donorName,
      amount: payment.amount,
    }),
  })
}

export const PaymentService = {
  async createTransaction(data: CreateTransactionInput) {
    const donation = await prisma.donation.create({
      data: {
        donorName: data.donorName,
        phone: data.phone,
        amount: data.amount,
        categoryId: data.categoryId,
        campaignId: data.campaignId,
        status: "pending",
      },
    })

    const orderId = `SIMAS-${donation.id}-${Date.now()}`

    const customerDetails = {
      first_name: data.donorName,
      email: data.donorEmail,
      ...(data.phone ? { phone: data.phone } : {}),
    }

    const transactionPayload: SnapTransactionParameters & {
      customer_details: typeof customerDetails
    } = {
      transaction_details: {
        order_id: orderId,
        gross_amount: data.amount,
      },
      customer_details: customerDetails,
    }

    const transaction = await snap.createTransaction(transactionPayload)

    try {
      await PaymentRepository.create({
        donationId: donation.id,
        campaignId: data.campaignId,
        orderId,
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        amount: data.amount,
        snapToken: transaction.token,
      })
    } catch (error) {
      await prisma.donation.delete({ where: { id: donation.id } })
      throw error
    }

    return {
      donationId: donation.id,
      orderId,
      snapToken: transaction.token,
      redirectUrl: transaction.redirect_url,
    }
  },

  async handleNotification(payload: MidtransWebhookPayload) {
    if (buildSignature(payload) !== payload.signature_key) {
      throw new Error("INVALID_SIGNATURE")
    }

    const payment = await PaymentRepository.findByOrderId(payload.order_id)
    if (!payment) {
      throw new Error("PAYMENT_NOT_FOUND")
    }

    await PaymentRepository.updateByOrderId(payload.order_id, {
      transactionId: payload.transaction_id,
      paymentType: payload.payment_type,
      transactionStatus: payload.transaction_status,
      fraudStatus: payload.fraud_status,
    })

    if (isSuccessTransactionStatus(payload.transaction_status)) {
      await prisma.donation.update({
        where: { id: payment.donationId },
        data: { status: "verified", verifiedAt: new Date() },
      })

      await sendDonationVerifiedEmail({
        donorEmail: payment.donorEmail,
        donorName: payment.donorName,
        amount: Number(payment.amount),
      })
    } else if (isFailedTransactionStatus(payload.transaction_status)) {
      await prisma.donation.update({
        where: { id: payment.donationId },
        data: { status: "rejected" },
      })
    }

    return true
  },
  async refund(
    orderId: string,
    reason: string,
    amount?: number
  ) {
    const payment = await PaymentRepository.findByOrderId(orderId)
    if (!payment) {
      throw new Error("PAYMENT_NOT_FOUND")
    }

    if (payment.transactionStatus !== "settlement") {
      throw new Error("PAYMENT_NOT_SETTLED")
    }

    const paymentAmount = Number(payment.amount)
    const refundAmount = amount ?? paymentAmount

    // Validate refund amount does not exceed payment amount
    if (refundAmount > paymentAmount) {
      throw new Error(
        `REFUND_AMOUNT_EXCEEDS_PAYMENT_AMOUNT: Refund ${refundAmount} > Payment ${paymentAmount}`
      )
    }

    const refundKey = `refund-${Date.now()}`

    await processRefund(orderId, {
      refund_key: refundKey,
      amount: refundAmount,
      reason,
    })

    await PaymentRepository.markRefunded(orderId, {
      refundAmount,
      refundReason: reason,
    })

    if (payment.donationId) {
      await prisma.donation.update({
        where: { id: payment.donationId },
        data: { status: "rejected" },
      })
    }

    return {
      orderId,
      refundAmount,
      reason,
    }
  }
}

import crypto from "crypto"

import prisma from "../../database"
import { midtransConfig } from "../../config/midtrans.config"
import { PaymentRepository } from "./payment.repository"
import type {
  CreateTransactionInput,
  MidtransWebhookPayload,
} from "./payment.type"

import { MailService } from "../mail/mail.service"
import { donationVerifiedTemplate } from "../mail/templates/donation-verified.template"
import { processRefund } from "./payment.utils"
import { requestMidtransSnapToken } from "./payment.tokenizer"

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

    const { snapToken, redirectUrl } =
      await requestMidtransSnapToken({
        orderId,
        amount: data.amount,
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        phone: data.phone,
      })

    try {
      await PaymentRepository.create({
        donationId: donation.id,
        campaignId: data.campaignId,
        orderId,
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        amount: data.amount,
        snapToken,
      })
    } catch (error) {
      await prisma.donation.delete({ where: { id: donation.id } })
      throw error
    }

    return {
      donationId: donation.id,
      orderId,
      snapToken,
      redirectUrl,
    }
  },

  async getTransactionStatus(orderId: string) {
    const payment = await PaymentRepository.findByOrderId(orderId)
    if (!payment) {
      throw new Error("PAYMENT_NOT_FOUND")
    }

    const baseUrl = midtransConfig.isProduction
      ? "https://app.midtrans.com/api/v2"
      : "https://app.sandbox.midtrans.com/api/v2"

    const statusUrl = `${baseUrl}/${orderId}/status`
    const authString = Buffer.from(
      `${midtransConfig.serverKey}:`
    ).toString("base64")

    const statusResp = await fetch(statusUrl, {
      method: "GET",
      headers: {
        Authorization: `Basic ${authString}`,
      },
    })

    if (!statusResp.ok) {
      const body = await statusResp.text()
      throw new Error(
        `MIDTRANS_STATUS_FAILED: ${statusResp.status} - ${body}`
      )
    }

    const midtransStatus = await statusResp.json()

    const updatedPayment = await PaymentRepository.updateByOrderId(
      orderId,
      {
        transactionId: midtransStatus.transaction_id,
        paymentType: midtransStatus.payment_type,
        transactionStatus: midtransStatus.transaction_status,
        fraudStatus: midtransStatus.fraud_status,
      }
    )

    if (isSuccessTransactionStatus(midtransStatus.transaction_status)) {
      await prisma.donation.update({
        where: { id: payment.donationId },
        data: { status: "verified", verifiedAt: new Date() },
      })
    } else if (isFailedTransactionStatus(midtransStatus.transaction_status)) {
      await prisma.donation.update({
        where: { id: payment.donationId },
        data: { status: "rejected" },
      })
    }

    return {
      payment: updatedPayment,
      midtrans: midtransStatus,
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

import midtransClient from "midtrans-client"

const serverKey =
  process.env.MIDTRANS_SERVER_KEY

const clientKey =
  process.env.MIDTRANS_CLIENT_KEY

const isProduction =
  process.env.MIDTRANS_IS_PRODUCTION === "true"

if (!serverKey || !clientKey) {
  throw new Error(
    "MIDTRANS_CONFIGURATION_MISSING"
  )
}

export const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
})

export const coreApi =
  new midtransClient.CoreApi({
    isProduction:
      process.env
        .MIDTRANS_IS_PRODUCTION ===
      "true",

    serverKey:
      process.env
        .MIDTRANS_SERVER_KEY || "",

    clientKey:
      process.env
        .MIDTRANS_CLIENT_KEY || ""
  })

export const midtransConfig = {
  serverKey,
  clientKey,
  isProduction,
  webhookSecret:
    process.env.MIDTRANS_WEBHOOK_SECRET,
}

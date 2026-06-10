import speakeasy from "speakeasy"
import QRCode from "qrcode"

export const TwoFactorService = {
  generateSecret(name?: string) {
    return speakeasy.generateSecret({ name: name || process.env.TWO_FACTOR_APP_NAME || "SIMAS" })
  },

  async generateQrCode(otpauthUrl: string) {
    return QRCode.toDataURL(otpauthUrl ?? "")
  },

  verifyTotp(secret: string, token: string) {
    return speakeasy.totp.verify({ secret, encoding: "base32", token, window: 1 })
  }
}

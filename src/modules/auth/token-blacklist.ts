import jwt from "jsonwebtoken"
import redis from "../../lib/redis"

type JwtWithExp = {
  exp: number
}

export const TokenBlacklistService = {

  async blacklistToken(
    token: string
  ): Promise<void> {

    const decoded =
      jwt.decode(token)

    if (
      !decoded ||
      typeof decoded === "string"
    ) {
      return
    }

    const payload =
      decoded as JwtWithExp

    if (!payload.exp) {
      return
    }

    const ttl =
      payload.exp -
      Math.floor(Date.now() / 1000)

    if (ttl <= 0) {
      return
    }

    await redis.set(
      `blacklist:${token}`,
      "revoked",
      "EX",
      ttl
    )
  },

  async isBlacklisted(
    token: string
  ): Promise<boolean> {

    const result =
      await redis.get(
        `blacklist:${token}`
      )

    return result !== null
  }
}
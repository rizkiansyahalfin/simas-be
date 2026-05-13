import { Request, Response, NextFunction } from "express"
import { UserService } from "./user.service"
import { createUserSchema, updateUserSchema } from "./user.validation"

const parsePage = (value: unknown) => {
  const page = Number(value)
  return Number.isNaN(page) || page < 1 ? 1 : Math.floor(page)
}

const parseLimit = (value: unknown) => {
  const limit = Number(value)
  if (Number.isNaN(limit) || limit < 1) return 10
  return Math.min(100, Math.floor(limit))
}

const parseBoolean = (value: unknown) => {
  if (typeof value === "string") {
    return value.toLowerCase() === "true" ? true : value.toLowerCase() === "false" ? false : undefined
  }
  return undefined
}

const parseString = (value: unknown) => {
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed.length ? trimmed : undefined
}

export const UserController = {

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parsePage(req.query.page)
      const limit = parseLimit(req.query.limit)
      const filters = {
        search: parseString(req.query.search),
        role: parseString(req.query.role),
        isActive: parseBoolean(req.query.isActive)
      }

      const result = await UserService.getAll(page, limit, filters)

      res.json({ status: "success", data: result })
    } catch (err) {
      next(err)
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createUserSchema.parse(req.body)

      const result = await UserService.create(validated)

      res.status(201).json({ status: "success", data: result })
    } catch (err) {
      next(err)
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      const validated = updateUserSchema.parse(req.body)

      const result = await UserService.update(id, validated)

      res.json({ status: "success", data: result })
    } catch (err) {
      next(err)
    }
  },

  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      const currentUserId = req.user!.id

      await UserService.activate(id, currentUserId)

      res.json({ status: "success", message: "User activated" })
    } catch (err) {
      next(err)
    }
  },

  async deactivate(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id)
      const currentUserId = req.user!.id

      await UserService.deactivate(id, currentUserId)

      res.json({ status: "success", message: "User deactivated" })
    } catch (err) {
      next(err)
    }
  }
}
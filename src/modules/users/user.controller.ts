import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler"
import { Role } from "../../generated/enums"
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

const parseRole = (value: unknown): Role | undefined => {
  const raw = parseString(value)
  if (!raw) return undefined
  if (raw === "superadmin" || raw === "bendahara" || raw === "admin_kegiatan" || raw === "admin_inventaris") {
    return raw as Role
  }
  return undefined
}

export const UserController = {

  getAll: asyncHandler(async (req: Request, res: Response) => {
      const page = parsePage(req.query.page)
      const limit = parseLimit(req.query.limit)
      const filters = {
        search: parseString(req.query.search),
        role: parseRole(req.query.role),
        isActive: parseBoolean(req.query.isActive)
      }

      const result = await UserService.getAll(page, limit, filters)

      res.json({ status: "success", data: result })
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
      const validated = createUserSchema.parse(req.body)

      const result = await UserService.create(validated)

      res.status(201).json({ status: "success", data: result })
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
      const id = Number(req.params.id)
      const validated = updateUserSchema.parse(req.body)

      const result = await UserService.update(id, validated)

      res.json({ status: "success", data: result })
  }),

  getProfile: asyncHandler(async (
  req: Request,
  res: Response
) => {
    const userId =
      req.user!.id

    const result =
      await UserService.getProfile(
        userId
      )

    res.json({
      status: "success",
      data: result
    })
  }),

  updateProfile: asyncHandler(async (
  req: Request,
  res: Response
) => {
    const userId =
      req.user!.id

    const result =
      await UserService.updateProfile(
        userId,
        {
          username:
            req.body.username,

          email:
            req.body.email,

          profileImage:
            req.file?.filename
        }
      )

    res.json({
      status: "success",
      data: result
    })
  }),

  activate: asyncHandler(async (req: Request, res: Response) => {
      const id = Number(req.params.id)
      const currentUserId = req.user!.id

      await UserService.activate(id, currentUserId)

      res.json({ status: "success", message: "User activated" })
  }),

  deactivate: asyncHandler(async (req: Request, res: Response) => {
      const id = Number(req.params.id)
      const currentUserId = req.user!.id

      await UserService.deactivate(id, currentUserId)

      res.json({ status: "success", message: "User deactivated" })
  })
}
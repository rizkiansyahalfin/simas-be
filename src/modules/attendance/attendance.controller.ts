import { Request, Response } from "express"
import { asyncHandler } from "../../utils/async-handler"
import { AttendanceService } from "./attendance.service"
import { createSessionSchema, checkInSchema } from "./attendance.validation"
import { attendanceReportSchema } from "./attendance.validation"

const parsePage = (value: unknown) => {
	const page = Number(value)
	return Number.isNaN(page) || page < 1 ? 1 : Math.floor(page)
}

const parseLimit = (value: unknown) => {
	const limit = Number(value)
	if (Number.isNaN(limit) || limit < 1) return 10
	return Math.min(100, Math.floor(limit))
}

export const AttendanceController = {
	getAll: asyncHandler(async (req: Request, res: Response) => {
			const page = parsePage(req.query.page)
			const limit = parseLimit(req.query.limit)

			const result = await AttendanceService.getSessions(page, limit, req.query.search as string | undefined)

			res.json({ status: "success", data: result })
	}),

	getById: asyncHandler(async (req: Request, res: Response) => {
			const id = Number(req.params.id)

			if (isNaN(id)) return res.status(400).json({ status: "error", message: "Invalid session ID" })

			const result = await AttendanceService.getSessionById(id)

			res.json({ status: "success", data: result })
	}),

	create: asyncHandler(async (req: Request, res: Response) => {
			const validated = createSessionSchema.parse(req.body)

			if (!req.user?.id) return res.status(401).json({ status: "error", message: "Unauthorized" })

			const payload = { ...validated, createdBy: req.user.id }

			const result = await AttendanceService.createSession(payload)

			res.status(201).json({ status: "success", data: result })
	}),

	update: asyncHandler(async (req: Request, res: Response) => {
			const id = Number(req.params.id)

			if (isNaN(id)) return res.status(400).json({ status: "error", message: "Invalid session ID" })

			const validated = createSessionSchema.partial().parse(req.body)

			const result = await AttendanceService.updateSession(id, validated)

			res.json({ status: "success", data: result })
	}),

	delete: asyncHandler(async (req: Request, res: Response) => {
			const id = Number(req.params.id)

			if (isNaN(id)) return res.status(400).json({ status: "error", message: "Invalid session ID" })

			await AttendanceService.deleteSession(id)

			res.json({ status: "success", message: "Session deleted" })
	}),

	checkIn: asyncHandler(async (req: Request, res: Response) => {
			const validated = checkInSchema.parse(req.body)

			const result = await AttendanceService.checkIn(validated)

			res.status(201).json({ status: "success", data: result })
	}),

	report: asyncHandler(async (
    req: Request,
    res: Response
  ) => {
      const query =
        attendanceReportSchema.parse(
          req.query
        )

      const result =
        await AttendanceService.report(
          query
        )

      res.json({
        status: "success",
        data: result
      })
  })
}
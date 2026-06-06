import { Request, Response, NextFunction } from "express"
import { AttendanceService } from "./attendance.service"
import { createSessionSchema, checkInSchema } from "./attendance.validation"

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
	async getAll(req: Request, res: Response, next: NextFunction) {
		try {
			const page = parsePage(req.query.page)
			const limit = parseLimit(req.query.limit)

			const result = await AttendanceService.getSessions(page, limit, req.query.search as string | undefined)

			res.json({ status: "success", data: result })
		} catch (err) {
			next(err)
		}
	},

	async getById(req: Request, res: Response, next: NextFunction) {
		try {
			const id = Number(req.params.id)

			if (isNaN(id)) return res.status(400).json({ status: "error", message: "Invalid session ID" })

			const result = await AttendanceService.getSessionById(id)

			res.json({ status: "success", data: result })
		} catch (err) {
			next(err)
		}
	},

	async create(req: Request, res: Response, next: NextFunction) {
		try {
			const validated = createSessionSchema.parse(req.body)

			if (!req.user?.id) return res.status(401).json({ status: "error", message: "Unauthorized" })

			const payload = { ...validated, createdBy: req.user.id }

			const result = await AttendanceService.createSession(payload)

			res.status(201).json({ status: "success", data: result })
		} catch (err) {
			next(err)
		}
	},

	async update(req: Request, res: Response, next: NextFunction) {
		try {
			const id = Number(req.params.id)

			if (isNaN(id)) return res.status(400).json({ status: "error", message: "Invalid session ID" })

			const validated = createSessionSchema.partial().parse(req.body)

			const result = await AttendanceService.updateSession(id, validated)

			res.json({ status: "success", data: result })
		} catch (err) {
			next(err)
		}
	},

	async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const id = Number(req.params.id)

			if (isNaN(id)) return res.status(400).json({ status: "error", message: "Invalid session ID" })

			await AttendanceService.deleteSession(id)

			res.json({ status: "success", message: "Session deleted" })
		} catch (err) {
			next(err)
		}
	},

	async checkIn(req: Request, res: Response, next: NextFunction) {
		try {
			const validated = checkInSchema.parse(req.body)

			const result = await AttendanceService.checkIn(validated)

			res.status(201).json({ status: "success", data: result })
		} catch (err) {
			next(err)
		}
	}
}

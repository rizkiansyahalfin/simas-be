import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import * as service from './jumat-schedule.service';
import { createJumatScheduleSchema, updateJumatScheduleSchema } from './jumat-schedule.validation';

export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const data = await service.getAll();
    res.json({ status: 'success', data });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
    const data = await service.getById(Number(req.params.id));
    res.json({ status: 'success', data });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createJumatScheduleSchema.parse(req.body);
    const userId = req.user?.id;
    const data = await service.create(validatedData, Number(userId));
    res.status(201).json({ status: 'success', data });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = updateJumatScheduleSchema.parse(req.body);
    const data = await service.update(Number(req.params.id), validatedData);
    res.json({ status: 'success', data });
});
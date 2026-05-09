import { Request, Response, NextFunction } from 'express';
import * as service from './jumat-schedule.service';
import { createJumatScheduleSchema, updateJumatScheduleSchema } from './jumat-schedule.validation';

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getAll();
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getById(Number(req.params.id));
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createJumatScheduleSchema.parse(req.body);
    const userId = (req as any).user?.id;
    const data = await service.create(validatedData, Number(userId));
    res.status(201).json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateJumatScheduleSchema.parse(req.body);
    const data = await service.update(Number(req.params.id), validatedData);
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};
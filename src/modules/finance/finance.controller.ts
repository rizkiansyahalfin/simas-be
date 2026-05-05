import { Request, Response, NextFunction } from 'express';
import * as service from './finance.service';
import {
  createCashSchema,
  createZisSchema,
  updateCashSchema,
  updateZisSchema,
} from './finance.validation';

const parsePage = (value: unknown) => {
  const page = Number(value);
  return Number.isNaN(page) || page < 1 ? 1 : Math.floor(page);
};

const parseLimit = (value: unknown) => {
  const limit = Number(value);
  if (Number.isNaN(limit) || limit < 1) return 10;
  return Math.min(100, Math.floor(limit));
};

const parseDate = (value: unknown) => {
  if (!value) return undefined;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const parseString = (value: unknown) => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
};

const parseType = (value: unknown) => {
  const raw = parseString(value);
  return raw ? raw.toLowerCase() : undefined;
};

export const getCash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);

    const filters = {
      type: parseType(req.query.type),
      category: parseString(req.query.category),
      search: parseString(req.query.search),
      startDate: parseDate(req.query.startDate),
      endDate: parseDate(req.query.endDate),
    };

    const data = await service.getCashTransactions({ page, limit, filters });
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getCashById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const data = await service.getCashTransactionById(id);

    if (!data) {
      return res.status(404).json({ status: 'error', message: 'Cash transaction not found' });
    }

    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getSummary();
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const postCash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCashSchema.parse(req.body);
    const userId = (req as any).user?.id || 1;

    const result = await service.addCashTransaction(validatedData, userId);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const putCash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const validatedData = updateCashSchema.parse(req.body);

    const result = await service.updateCashTransaction(id, validatedData);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const deleteCash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await service.removeCashTransaction(id);
    res.json({ status: 'success', message: 'Cash transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getZis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);

    const filters = {
      type: parseType(req.query.type),
      zisCategory: parseType(req.query.zisCategory),
      search: parseString(req.query.search),
      startDate: parseDate(req.query.startDate),
      endDate: parseDate(req.query.endDate),
    };

    const data = await service.getZisTransactions({ page, limit, filters });
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const getZisById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const data = await service.getZisTransactionById(id);

    if (!data) {
      return res.status(404).json({ status: 'error', message: 'ZIS transaction not found' });
    }

    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const postZis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createZisSchema.parse(req.body);
    const userId = (req as any).user?.id || 1;

    const result = await service.addZisTransaction(validatedData, userId);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const putZis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const validatedData = updateZisSchema.parse(req.body);

    const result = await service.updateZisTransaction(id, validatedData);
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const deleteZis = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    await service.removeZisTransaction(id);
    res.json({ status: 'success', message: 'ZIS transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};
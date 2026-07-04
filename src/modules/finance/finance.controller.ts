import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { TransactionType, ZisCategory } from '../../generated/enums';
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

const parseTransactionType = (value: unknown): TransactionType | undefined => {
  const raw = parseString(value);
  if (!raw) return undefined;
  if (raw === 'income' || raw === 'expense') return raw as TransactionType;
  return undefined;
};

const parseZisCategory = (value: unknown): ZisCategory | undefined => {
  const raw = parseString(value);
  if (!raw) return undefined;
  if (raw === 'zakat' || raw === 'infaq' || raw === 'shadaqah') return raw as ZisCategory;
  return undefined;
};

export const getCash = asyncHandler(async (req: Request, res: Response) => {
    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);

    const filters = {
      type: parseTransactionType(req.query.type),
      category: parseString(req.query.category),
      search: parseString(req.query.search),
      startDate: parseDate(req.query.startDate),
      endDate: parseDate(req.query.endDate),
    };

    const data = await service.getCashTransactions({ page, limit, filters });
    res.json({ status: 'success', data });
});

export const getCashById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = await service.getCashTransactionById(id);

    if (!data) {
      return res.status(404).json({ status: 'error', message: 'Cash transaction not found' });
    }

    res.json({ status: 'success', data });
});

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
    const data = await service.getSummary();
    res.json({ status: 'success', data });
});

export const postCash = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createCashSchema.parse(req.body);
    const userId = req.user?.id ?? 1;

    const result = await service.addCashTransaction(validatedData, userId);
    res.status(201).json({ status: 'success', data: result });
});

export const putCash = asyncHandler(async (
  req: Request,
  res: Response
) => {
    const id = Number(req.params.id)

    const validatedData =
      updateCashSchema.parse(req.body)

    const result =
      await service.updateCashTransaction(
        id,
        validatedData
      )

    res.json({
      status: "success",
      data: result
    })
})

export const deleteCash = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await service.removeCashTransaction(id);
    res.json({ status: 'success', message: 'Cash transaction deleted successfully' });
});

export const getZis = asyncHandler(async (req: Request, res: Response) => {
    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);

    const filters = {
      type: parseTransactionType(req.query.type),
      zisCategory: parseZisCategory(req.query.zisCategory),
      search: parseString(req.query.search),
      startDate: parseDate(req.query.startDate),
      endDate: parseDate(req.query.endDate),
    };

    const data = await service.getZisTransactions({ page, limit, filters });
    res.json({ status: 'success', data });
});

export const getZisById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const data = await service.getZisTransactionById(id);

    if (!data) {
      return res.status(404).json({ status: 'error', message: 'ZIS transaction not found' });
    }

    res.json({ status: 'success', data });
});

export const postZis = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = createZisSchema.parse(req.body);
    const userId = req.user?.id ?? 1;

    const result = await service.addZisTransaction(validatedData, userId);
    res.status(201).json({ status: 'success', data: result });
});

export const putZis = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const validatedData = updateZisSchema.parse(req.body);

    const result = await service.updateZisTransaction(id, validatedData);
    res.json({ status: 'success', data: result });
});

export const deleteZis = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await service.removeZisTransaction(id);
    res.json({ status: 'success', message: 'ZIS transaction deleted successfully' });
});
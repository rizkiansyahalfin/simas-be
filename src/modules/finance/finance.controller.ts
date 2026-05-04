import { Request, Response, NextFunction } from 'express';
import * as service from './finance.service';
import { createCashSchema } from './finance.validation';

export const getCash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await service.getTransactions();
    res.json({ status: 'success', data });
  } catch (error) {
    next(error);
  }
};

export const postCash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCashSchema.parse(req.body);
    // Asumsi Anda punya middleware auth yang mengisi req.user
    const userId = (req as any).user?.id || 1; 

    const result = await service.addTransaction(validatedData, userId);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const deleteCash = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await service.removeTransaction(Number(id));
    res.json({ status: 'success', message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
};
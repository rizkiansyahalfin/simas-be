import * as repo from './finance.repository';
import { CreateCashInput } from './finance.type';

export const getTransactions = async () => {
  return await repo.findAll();
};

export const addTransaction = async (data: CreateCashInput, userId: number) => {
  return await repo.create({
    ...data,
    createdBy: userId,
  });
};

export const removeTransaction = async (id: number) => {
  return await repo.softDelete(id);
};
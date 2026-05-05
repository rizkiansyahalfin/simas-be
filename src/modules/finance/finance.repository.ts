import prisma from '../../database';

export const findAll = async () => {
  return await prisma.cashTransaction.findMany({
    where: { deletedAt: null },
    orderBy: { transactionDate: 'desc' },
  });
};

export const create = async (data: any) => {
  return await prisma.cashTransaction.create({
    data,
  });
};

export const softDelete = async (id: number) => {
  return await prisma.cashTransaction.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
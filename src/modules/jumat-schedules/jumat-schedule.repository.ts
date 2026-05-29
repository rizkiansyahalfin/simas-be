import prisma from '../../database';
import { CreateJumatScheduleInput, UpdateJumatScheduleInput } from './jumat-schedule.type';

export const findAll = async () => {
  return await prisma.jumatSchedule.findMany({
    orderBy: { jumatDate: 'desc' },
    include: {
      creator: {
        select: { id: true, username: true },
      },
    },
  });
};

export const findById = async (id: number) => {
  return await prisma.jumatSchedule.findUnique({
    where: { id },
    include: {
      creator: {
        select: { id: true, username: true },
      },
    },
  });
};

export const findByDate = async (date: Date) => {
  return await prisma.jumatSchedule.findFirst({
    where: {
      jumatDate: date,
    },
    include: {
      creator: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  })
};

export const create = async (data: CreateJumatScheduleInput, createdBy: number) => {
  return await prisma.jumatSchedule.create({
    data: {
      jumatDate: new Date(data.jumatDate),
      imam: data.imam,
      khatib: data.khatib,
      muadzin: data.muadzin,
      temaKhutbah: data.temaKhutbah,
      createdBy,
    },
    include: {
      creator: {
        select: { id: true, username: true },
      },
    },
  });
};

export const update = async (id: number, data: UpdateJumatScheduleInput) => {
  return await prisma.jumatSchedule.update({
    where: { id },
    data: {
      ...(data.jumatDate && { jumatDate: new Date(data.jumatDate) }),
      ...(data.imam !== undefined && { imam: data.imam }),
      ...(data.khatib !== undefined && { khatib: data.khatib }),
      ...(data.muadzin !== undefined && { muadzin: data.muadzin }),
      ...(data.temaKhutbah !== undefined && { temaKhutbah: data.temaKhutbah }),
    },
    include: {
      creator: {
        select: { id: true, username: true },
      },
    },
  });
};
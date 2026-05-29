import * as repo from './jumat-schedule.repository';
import { CreateJumatScheduleInput, UpdateJumatScheduleInput } from './jumat-schedule.type';

export const getAll = async () => {
  return await repo.findAll();
};

export const getById = async (id: number) => {
  const schedule = await repo.findById(id);
  if (!schedule) {
    const error = new Error('Jadwal Jumat tidak ditemukan') as Error & { status: number };
    error.status = 404;
    throw error;
  }
  return schedule;
};

export const getByDate = async (
  date: Date
) => {

  const parsedDate = new Date(date)

  parsedDate.setHours(0, 0, 0, 0)

  return await repo.findByDate(
    parsedDate
  )
}

export const create = async (data: CreateJumatScheduleInput, createdBy: number) => {
  return await repo.create(data, createdBy);
};

export const update = async (id: number, data: UpdateJumatScheduleInput) => {
  await getById(id);
  return await repo.update(id, data);
};
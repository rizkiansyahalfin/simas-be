import * as repo from './jumat-schedule.repository';
export const getAll = async () => {
    return await repo.findAll();
};
export const getById = async (id) => {
    const schedule = await repo.findById(id);
    if (!schedule) {
        const error = new Error('Jadwal Jumat tidak ditemukan');
        error.status = 404;
        throw error;
    }
    return schedule;
};
export const create = async (data, createdBy) => {
    return await repo.create(data, createdBy);
};
export const update = async (id, data) => {
    await getById(id);
    return await repo.update(id, data);
};

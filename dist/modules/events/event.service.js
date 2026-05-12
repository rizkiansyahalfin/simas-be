import { EventRepository } from "./event.repository";
export const EventService = {
    async getAll({ status, page, limit }) {
        const skip = (page - 1) * limit;
        return EventRepository.findAll({
            status,
            skip,
            limit
        });
    },
    async create(data, userId) {
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        if (end <= start) {
            throw new Error("INVALID_EVENT_TIME");
        }
        // Validate that dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error("INVALID_DATE_FORMAT");
        }
        return EventRepository.create({
            ...data,
            createdBy: userId
        });
    },
    async update(id, data) {
        const existing = await EventRepository.findById(id);
        if (!existing) {
            throw new Error("EVENT_NOT_FOUND");
        }
        // If updating times, validate them
        if (data.startTime || data.endTime) {
            const start = new Date(data.startTime || existing.startTime);
            const end = new Date(data.endTime || existing.endTime);
            if (end <= start) {
                throw new Error("INVALID_EVENT_TIME");
            }
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new Error("INVALID_DATE_FORMAT");
            }
        }
        return EventRepository.update(id, data);
    },
    async updateStatus(id, status) {
        const existing = await EventRepository.findById(id);
        if (!existing) {
            throw new Error("EVENT_NOT_FOUND");
        }
        return EventRepository.update(id, { status: status });
    },
    async delete(id) {
        const existing = await EventRepository.findById(id);
        if (!existing) {
            throw new Error("EVENT_NOT_FOUND");
        }
        return EventRepository.delete(id);
    }
};

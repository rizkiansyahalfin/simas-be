import { z } from "zod";
export const createEventSchema = z.object({
    title: z.string().min(3).max(255),
    description: z.string().optional(),
    speaker: z.string().max(100).optional(),
    location: z.string().max(255).optional(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime()
});
export const updateEventSchema = createEventSchema.partial();
export const updateStatusSchema = z.object({
    status: z.enum([
        "upcoming",
        "ongoing",
        "completed",
        "cancelled"
    ])
});

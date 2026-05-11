import prisma from "../../database";
export const PrayerRepository = {
    async findByDate(date, city) {
        return prisma.prayerSchedule.findFirst({
            where: {
                prayerDate: date,
                city
            }
        });
    },
    async create(data) {
        return prisma.prayerSchedule.create({ data });
    }
};

import prisma from "../../database";
export const PrayerRepository = {
    async findByDate(date, city) {
        return prisma.prayerSchedule.findUnique({
            where: {
                prayerDate_city: {
                    prayerDate: date,
                    city
                }
            }
        });
    },
    async upsert(data) {
        return prisma.prayerSchedule.upsert({
            where: {
                prayerDate_city: {
                    prayerDate: data.prayerDate,
                    city: data.city
                }
            },
            update: data,
            create: data
        });
    }
};

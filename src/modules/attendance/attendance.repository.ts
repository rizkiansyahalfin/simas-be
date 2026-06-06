import prisma from "../../database"

export const AttendanceRepository = {

  async createSession(data: {
    title: string
    type: "prayer" | "event"
    sessionDate: Date
    startTime: Date
    endTime?: Date
    notes?: string
    createdBy: number
  }) {
    return prisma.attendanceSession.create({
      data
    })
  },

  async findSessionById(id: number) {
    return prisma.attendanceSession.findUnique({
      where: { id }
    })
  },

  async findSessions({
    type,
    date,
    skip,
    limit,
  }: {
    type?: string
    date?: Date
    skip: number
    limit: number
  }) {

    return prisma.attendanceSession.findMany({
      where: {
        ...(type && {
          type:
            type as
            "prayer" |
            "event"
        }),

        ...(date && {
          sessionDate: date
        })
      },

      orderBy: {
        sessionDate: "desc"
      },

      skip,
      take: limit,
    })
  },

  async updateSession(
    id: number,
    data: Record<string, unknown>
  ) {
    return prisma.attendanceSession.update({
      where: { id },
      data,
    })
  },

  async deleteSession(id: number) {
    return prisma.attendanceSession.delete({
      where: { id }
    })
  },

  async findCongregationByNik(
    nik: string
  ) {
    return prisma.congregation.findFirst({
      where: {
        nik,
        deletedAt: null,
      }
    })
  },

  async findRecord(
    congregationId: number,
    sessionId: number
  ) {
    return prisma.attendanceRecord.findUnique({
      where: {
        congregationId_sessionId: {
          congregationId,
          sessionId,
        }
      }
    })
  },

  async createRecord(data: {
    congregationId: number
    sessionId: number
    method: "qr_code" | "manual"
  }) {
    return prisma.attendanceRecord.create({
      data
    })
  },
}
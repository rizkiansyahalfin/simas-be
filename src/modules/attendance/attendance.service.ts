import { AttendanceRepository } from "./attendance.repository";
import prisma from "../../database";
import { CheckInInput, CreateSessionInput  } from "./attendance.type";
import { AttendanceReportInput } from "./attendance.validation";
import type { AttendanceSessionWhereInput } from "../../generated/models";

export const AttendanceService = {

  

    async checkIn({
  sessionId,
  nik,
  congregationId,
  method,
}: CheckInInput) {

  const session =
    await AttendanceRepository
      .findSessionById(
        sessionId
      )

  if (!session) {
    throw new Error(
      "SESSION_NOT_FOUND"
    )
  }

  let congregation

  if (nik) {

    congregation =
      await AttendanceRepository
        .findCongregationByNik(
          nik
        )

  } else if (
    congregationId
  ) {

    congregation =
      await prisma.congregation.findUnique({
        where: {
          id:
            congregationId
        }
      })
  }

  if (!congregation) {
    throw new Error(
      "CONGREGATION_NOT_FOUND"
    )
  }

  const existing =
    await AttendanceRepository
      .findRecord(
        congregation.id,
        sessionId
      )

  if (existing) {
    throw new Error(
      "ALREADY_CHECKED_IN"
    )
  }

  return AttendanceRepository
    .createRecord({
      congregationId:
        congregation.id,

      sessionId,

      method,
    })
},

  async createSession(data: CreateSessionInput) {
    return prisma.attendanceSession.create({
      data,
    })  },

  async getSessionById(id: number) {
    const session = await AttendanceRepository.findSessionById(id)

    if (!session) throw new Error("SESSION_NOT_FOUND")

    return session
  },

  async updateSession(id: number, data: Partial<CreateSessionInput>) {
    const existing = await AttendanceRepository.findSessionById(id)

    if (!existing) throw new Error("SESSION_NOT_FOUND")

    return AttendanceRepository.updateSession(id, data as Record<string, unknown>)
  },

  async deleteSession(id: number) {
    const existing = await AttendanceRepository.findSessionById(id)

    if (!existing) throw new Error("SESSION_NOT_FOUND")

    return AttendanceRepository.deleteSession(id)
  },

  async getSessions(
    page: number,
    limit: number,
    search?: string
  ) {
    const skip = (page - 1) * limit || 0

    return prisma.attendanceSession.findMany({
      where: {
        ...(search && {
          title: {
            contains: search,
            mode: "insensitive",
          },
        }),
      } as AttendanceSessionWhereInput,
      orderBy: {
        sessionDate: "desc",
      },
      skip,
      take: limit,
    })
  },
  async report(
    query: AttendanceReportInput
  ) {
    const dateFrom =
      query.date_from
        ? new Date(query.date_from)
        : undefined

    const dateTo =
      query.date_to
        ? new Date(query.date_to)
        : undefined

    const [records, totalSessions] =
      await Promise.all([
        AttendanceRepository.getReport(
          query.session_id,
          dateFrom,
          dateTo
        ),

        AttendanceRepository.countSessions(
          query.session_id,
          dateFrom,
          dateTo
        )
      ])

    const attendanceMap = new Map<
      number,
      {
        congregationId: number
        fullName: string
        attendanceCount: number
      }
    >()

    for (const record of records) {
      const congregation = record.congregation

      if (!congregation) continue

      const existing = attendanceMap.get(congregation.id)

      if (existing) {
        existing.attendanceCount += 1
      } else {
        attendanceMap.set(congregation.id, {
          congregationId: congregation.id,
          fullName: congregation.fullName,
          attendanceCount: 1
        })
      }
    }

    const report = Array.from(attendanceMap.values()).map((item) => ({
      ...item,
      attendancePercentage:
        totalSessions === 0
          ? 0
          : Number(((item.attendanceCount / totalSessions) * 100).toFixed(2))
    }))

    return {
      totalSessions,
      totalAttendanceRecords: records.length,
      report
    }
  }
}
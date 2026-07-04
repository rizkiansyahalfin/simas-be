import { EventStatus } from "../../generated/enums"
import { EventRepository } from "./event.repository"
import type {
  Event,
  CreateEventData,
  UpdateEventData,
  EventQueryParams,
  PaginatedEvents
} from "./event.type"
import {
  addDays,
  startOfDay,
  endOfDay,
} from 'date-fns'

import prisma from '../../database'

import {
  NotificationTrigger,
} from '../notification/notification.trigger'

import { clearDashboardCache } from '../dashboard/dashboard.cache'

export const EventService = {
  async getAll({
    status,
    search,
    page,
    limit
  }: EventQueryParams): Promise<PaginatedEvents> {
    const skip = (page - 1) * limit

    return EventRepository.findAll({
      status,
      search,
      skip,
      limit
    })
  },

  async create(data: CreateEventData, userId: number, posterUrl?: string): Promise<Event> {
    const start = new Date(data.startTime)
    const end = new Date(data.endTime)

    if (end <= start) {
      throw new Error("INVALID_EVENT_TIME")
    }

    // Validate that dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("INVALID_DATE_FORMAT")
    }

    const result = await EventRepository.create({
      ...data,
      posterUrl,
      createdBy: userId
    })
    await clearDashboardCache()
    return result
  },

  async update(id: number, data: UpdateEventData, posterUrl?: string): Promise<Event> {
    const existing = await EventRepository.findById(id)

    if (!existing) {
      throw new Error("EVENT_NOT_FOUND")
    }

    if (posterUrl) {
      data.posterUrl = posterUrl
    }

    // If updating times, validate them
    if (data.startTime || data.endTime) {
      const start = new Date(data.startTime || existing.startTime)
      const end = new Date(data.endTime || existing.endTime)

      if (end <= start) {
        throw new Error("INVALID_EVENT_TIME")
      }

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("INVALID_DATE_FORMAT")
      }
    }

    const result = await EventRepository.update(id, { ...data, posterUrl })
    await clearDashboardCache()
    return result
  },

  async updateStatus(id: number, status: string): Promise<Event> {
    const existing = await EventRepository.findById(id)

    if (!existing) {
      throw new Error("EVENT_NOT_FOUND")
    }

    const result = await EventRepository.update(id, { status: status as EventStatus })
    await clearDashboardCache()
    return result
  },
async sendTomorrowReminders() {

  const tomorrow =
    addDays(new Date(), 1)

  const events =
    await prisma.event.findMany({
      where: {
        startTime: {
          gte: startOfDay(
            tomorrow
          ),

          lte: endOfDay(
            tomorrow
          ),
        },

        status: 'upcoming',
      },
    })

  for (const event of events) {

    await NotificationTrigger.eventReminder({
      eventId: event.id,
      eventTitle: event.title,
    })
  }

  return events.length
},

  async delete(id: number): Promise<Event> {
    const existing = await EventRepository.findById(id)

    if (!existing) {
      throw new Error("EVENT_NOT_FOUND")
    }

    const result = await EventRepository.delete(id)
    await clearDashboardCache()
    return result
  }
}
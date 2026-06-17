import prisma from "../../database"
import { Prisma } from "../../generated/client"
import { EventStatus } from "../../generated/enums"
import type {
  Event,
  CreateEventData,
  UpdateEventData,
  EventRepositoryParams,
  PaginatedEvents
} from "./event.type"

export const EventRepository = {
  async findAll({
    status,
    search,
    skip,
    limit
  }: EventRepositoryParams): Promise<PaginatedEvents> {
    const whereClause: Prisma.EventWhereInput = {
  ...(status && {
    status: status as EventStatus
  }),

  ...(search && {
    OR: [
      {
        title: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        description: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        speaker: {
          contains: search,
          mode: "insensitive"
        }
      },
      {
        location: {
          contains: search,
          mode: "insensitive"
        }
      }
    ]
  })
}

    const [data, total] = await Promise.all([
      prisma.event.findMany({
        where: whereClause,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              role: true
            }
          }
        },
        orderBy: {
          startTime: "asc"
        },
        skip,
        take: limit
      }),
      prisma.event.count({
        where: whereClause
      })
    ])

    return {
      data: data as Event[],
      meta: {
        total,
        page: Math.floor(skip / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  },

  async findById(id: number): Promise<Event | null> {
    return prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    }) as Promise<Event | null>
  },

  async create(data: CreateEventData & { createdBy: number }): Promise<Event> {
    return prisma.event.create({
      data,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    }) as Promise<Event>
  },

  async update(id: number, data: UpdateEventData): Promise<Event> {
    return prisma.event.update({
      where: { id },
      data,
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            role: true
          }
        }
      }
    }) as Promise<Event>
  },

  async delete(id: number): Promise<Event> {
    return prisma.event.delete({
      where: { id }
    }) as Promise<Event>
  }
}
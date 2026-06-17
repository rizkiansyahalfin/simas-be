import { EventStatus } from "../../generated/enums"

export interface Event {
  id: number
  title: string
  description?: string
  speaker?: string
  location?: string
  startTime: Date
  endTime: Date
  status: EventStatus
  createdBy: number
  createdAt: Date
  creator?: {
    id: number
    username: string
    role: string
  }
}

export interface CreateEventData {
  title: string
  description?: string
  speaker?: string
  location?: string
  startTime: string
  endTime: string
}

export interface UpdateEventData {
  title?: string
  description?: string
  speaker?: string
  location?: string
  startTime?: string
  endTime?: string
  status?: EventStatus
}

export interface EventQueryParams {
  status?: string
  search?: string
  page: number
  limit: number
}

export interface EventRepositoryParams {
  status?: string
  search?: string
  skip: number
  limit: number
}

export interface PaginatedEvents {
  data: Event[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}


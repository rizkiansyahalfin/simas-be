export type CreateSessionInput = {
  title: string
  type: "prayer" | "event"
  sessionDate: Date
  startTime: Date
  endTime?: Date
  notes?: string
  createdBy: number
}

export type CheckInInput = {
  sessionId: number
  nik?: string
  congregationId?: number
  method: "qr_code" | "manual"
}
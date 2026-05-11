export interface CreateJumatScheduleInput {
  jumatDate: string;
  imam?: string;
  khatib?: string;
  muadzin?: string;
  temaKhutbah?: string;
}

export interface UpdateJumatScheduleInput {
  jumatDate?: string;
  imam?: string;
  khatib?: string;
  muadzin?: string;
  temaKhutbah?: string;
}
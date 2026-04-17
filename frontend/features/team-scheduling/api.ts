import { api } from "@/lib/apiClient";
import type { ScheduleEntry, ScheduleEntryRequest, TeamWeekResponse } from "./types";

export const teamSchedulingApi = {
  setSchedule: (data: ScheduleEntryRequest) =>
    api.post<ScheduleEntry>("/team-scheduling/schedule", data),

  getScheduleForDate: (date: string) =>
    api.get<ScheduleEntry[]>(`/team-scheduling/schedule?date=${date}`),

  getTeamWeek: (weekStart: string) =>
    api.get<TeamWeekResponse[]>(`/team-scheduling/schedule/week?weekStart=${weekStart}`),

  getEmployeeSchedule: (employeeId: string) =>
    api.get<ScheduleEntry[]>(`/team-scheduling/schedule/employee/${employeeId}`),
};
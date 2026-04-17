export interface ScheduleEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  workMode: "OFFICE" | "REMOTE" | "LEAVE";
}

export interface TeamWeekResponse {
  department: string;
  entries: ScheduleEntry[];
}

export interface ScheduleEntryRequest {
  employeeId: string;
  date: string;
  workMode: "OFFICE" | "REMOTE" | "LEAVE";
}
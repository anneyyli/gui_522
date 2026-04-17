export interface DeskAvailability {
  deskId: string;
  deskLabel: string;
  floor: string;
  zone: string;
  hasMonitor: boolean;
  hasStandingOption: boolean;
  available: boolean;
}

export interface BookingResponse {
  id: string;
  deskId: string;
  deskLabel: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: "CONFIRMED" | "CANCELLED";
}

export interface CreateBookingRequest {
  deskId: string;
  employeeId: string;
  date: string;
}
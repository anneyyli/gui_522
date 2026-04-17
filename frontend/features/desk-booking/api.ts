import { api } from "@/lib/apiClient";
import type { BookingResponse, CreateBookingRequest, DeskAvailability } from "./types";

export const deskBookingApi = {
  getAvailability: (date: string) =>
    api.get<DeskAvailability[]>(`/desk-booking/availability?date=${date}`),

  createBooking: (data: CreateBookingRequest) =>
    api.post<BookingResponse>("/desk-booking/bookings", data),

  getMyBookings: (employeeId: string) =>
    api.get<BookingResponse[]>(`/desk-booking/bookings/employee/${employeeId}`),

  cancelBooking: (bookingId: string) =>
    api.delete(`/desk-booking/bookings/${bookingId}`),
};
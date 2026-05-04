import { api } from "@/lib/apiClient";
import type { RoomAvailability, RoomBookingResponse, CreateRoomBookingRequest } from "./types";

export const roomBookingApi = {
  getRoomAvailability: (date: string) =>
    api.get<RoomAvailability[]>(`/room-booking/rooms?date=${date}`),

  getMyBookings: (employeeId: string) =>
    api.get<RoomBookingResponse[]>(`/room-booking/bookings/employee/${employeeId}`),

  createBooking: (data: CreateRoomBookingRequest) =>
    api.post<RoomBookingResponse>("/room-booking/bookings", data),

  cancelBooking: (bookingId: string) =>
    api.delete(`/room-booking/bookings/${bookingId}`),
};

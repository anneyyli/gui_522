/**
 * Displays the user's active bookings (desks and/or rooms) with inline cancel.
 * A "filter" prop controls which booking type is shown — used to split desk and
 * room bookings across their respective tabs while sharing one component.
 * After cancellation, callbacks notify the parent so the floor plan or room
 * availability grid can update without requiring a full page refresh.
 */
"use client";
import { useEffect, useState } from "react";
import { deskBookingApi } from "./api";
import { roomBookingApi } from "../room-booking/api";
import type { BookingResponse } from "./types";
import type { RoomBookingResponse } from "../room-booking/types";

interface Props {
  employeeId: string;
  refresh: number;
  onCancelled?: (booking: BookingResponse) => void;
  onRoomCancelled?: () => void;
  filter?: "all" | "desks" | "rooms";
}

export default function MyBookings({ employeeId, refresh, onCancelled, onRoomCancelled, filter = "all" }: Props) {
  const [deskBookings, setDeskBookings] = useState<BookingResponse[]>([]);
  const [roomBookings, setRoomBookings] = useState<RoomBookingResponse[]>([]);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    deskBookingApi.getMyBookings(employeeId).then(setDeskBookings);
    roomBookingApi.getMyBookings(employeeId).then(setRoomBookings).catch(() => {});
  }, [employeeId, refresh]);

  const handleCancelDesk = async (booking: BookingResponse) => {
    setCancelling(booking.id);
    try {
      await deskBookingApi.cancelBooking(booking.id);
      setDeskBookings((current) => current.filter((b) => b.id !== booking.id));
      onCancelled?.(booking);
    } catch {
      const updated = await deskBookingApi.getMyBookings(employeeId);
      setDeskBookings(updated);
    } finally {
      setCancelling(null);
    }
  };

  const handleCancelRoom = async (bookingId: string) => {
    setCancelling(bookingId);
    try {
      await roomBookingApi.cancelBooking(bookingId);
      setRoomBookings((current) => current.filter((b) => b.id !== bookingId));
      onRoomCancelled?.();
    } catch {
      const updated = await roomBookingApi.getMyBookings(employeeId);
      setRoomBookings(updated);
    } finally {
      setCancelling(null);
    }
  };

  const activeDesks = filter === "rooms" ? [] : deskBookings.filter(b => b.status === "CONFIRMED");
  const activeRooms = filter === "desks" ? [] : roomBookings.filter(b => b.status === "CONFIRMED");

  if (!activeDesks.length && !activeRooms.length) {
    return <p className="text-slate-400 text-sm py-4">No upcoming bookings.</p>;
  }

  return (
    <div className="space-y-2">
      {activeDesks.map(b => (
        <div key={b.id} className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-teal-50 text-teal-600">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-sm text-slate-900">{b.deskLabel}</p>
              <p className="text-[11px] text-slate-500">{b.date}</p>
            </div>
          </div>
          <button
            onClick={() => handleCancelDesk(b)}
            disabled={cancelling === b.id}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors disabled:opacity-50"
          >
            {cancelling === b.id ? "Cancelling…" : "Cancel"}
          </button>
        </div>
      ))}

      {activeRooms.map(b => (
        <div key={b.id} className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-600">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </span>
            <div>
              <p className="font-medium text-sm text-slate-900">{b.roomName}</p>
              <p className="text-[11px] text-slate-500">{b.date} · {b.timeSlot}</p>
            </div>
          </div>
          <button
            onClick={() => handleCancelRoom(b.id)}
            disabled={cancelling === b.id}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium transition-colors disabled:opacity-50"
          >
            {cancelling === b.id ? "Cancelling…" : "Cancel"}
          </button>
        </div>
      ))}
    </div>
  );
}

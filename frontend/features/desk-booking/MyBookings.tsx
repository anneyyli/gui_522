"use client";
import { useEffect, useState } from "react";
import { deskBookingApi } from "./api";
import type { BookingResponse } from "./types";

interface Props {
  employeeId: string;
  refresh: number;
  onCancelled?: (booking: BookingResponse) => void;
}

export default function MyBookings({ employeeId, refresh, onCancelled }: Props) {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    deskBookingApi.getMyBookings(employeeId).then(setBookings);
  }, [employeeId, refresh]);

  const handleCancel = async (booking: BookingResponse) => {
    setCancelling(booking.id);
    try {
      await deskBookingApi.cancelBooking(booking.id);
      setBookings((current) => current.filter((b) => b.id !== booking.id));
      onCancelled?.(booking);
    } catch {
      const updated = await deskBookingApi.getMyBookings(employeeId);
      setBookings(updated);
    } finally {
      setCancelling(null);
    }
  };

  const active = bookings.filter(b => b.status === "CONFIRMED");
  if (!active.length) return <p className="text-gray-400 text-sm py-4">No upcoming bookings.</p>;

  return (
    <div className="space-y-2">
      {active.map(b => (
        <div key={b.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div>
            <p className="font-medium text-sm">{b.deskLabel}</p>
            <p className="text-xs text-gray-500">{b.date}</p>
          </div>
          <button
            onClick={() => handleCancel(b)}
            disabled={cancelling === b.id}
            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
          >
            {cancelling === b.id ? "Cancelling…" : "Cancel"}
          </button>
        </div>
      ))}
    </div>
  );
}

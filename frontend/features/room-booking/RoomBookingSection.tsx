/**
 * Meeting room booking with an hourly time-slot grid. Users first select a room
 * (showing capacity and amenities like Video/Whiteboard), then pick an available
 * slot. Booked slots are disabled and greyed out to prevent double-booking.
 * Re-fetches availability when the parent's `refresh` counter changes, enabling
 * cross-component reactivity (e.g., cancelling from MyBookings frees the slot).
 */
"use client";

import { useEffect, useState } from "react";
import { roomBookingApi } from "./api";
import type { RoomAvailability } from "./types";

const TIME_SLOTS = [
  "09:00–10:00",
  "10:00–11:00",
  "11:00–12:00",
  "12:00–13:00",
  "13:00–14:00",
  "14:00–15:00",
  "15:00–16:00",
  "16:00–17:00",
];

interface Props {
  date: string;
  employeeId: string;
  onBooked?: () => void;
  refresh?: number;
}

export default function RoomBookingSection({ date, employeeId, onBooked, refresh }: Props) {
  const [rooms, setRooms] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [justBooked, setJustBooked] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    roomBookingApi.getRoomAvailability(date)
      .then(setRooms)
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, [date, refresh]);

  const handleBook = async (roomId: string, timeSlot: string) => {
    setBooking(true);
    try {
      await roomBookingApi.createBooking({ roomId, employeeId, date, timeSlot });
      setRooms((current) =>
        current.map((r) =>
          r.roomId === roomId ? { ...r, bookedSlots: [...r.bookedSlots, timeSlot] } : r
        )
      );
      setJustBooked(`${roomId}-${timeSlot}`);
      setTimeout(() => setJustBooked(null), 2000);
      onBooked?.();
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Failed to book room.");
      setTimeout(() => setBookingError(null), 5000);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return <p className="py-4 text-center text-sm text-slate-400">Loading rooms…</p>;
  }

  if (rooms.length === 0) return null;

  const selected = rooms.find((r) => r.roomId === selectedRoom);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Meeting Rooms</h2>
      <p className="mt-0.5 text-sm text-slate-500">Book a room for the selected date</p>

      {bookingError && (
        <div role="alert" className="mt-3 flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
          <p className="text-sm font-medium text-rose-800">{bookingError}</p>
          <button type="button" onClick={() => setBookingError(null)} className="ml-auto text-rose-400 hover:text-rose-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => {
          const freeSlots = TIME_SLOTS.length - room.bookedSlots.length;
          const isSelected = selectedRoom === room.roomId;
          return (
            <button
              key={room.roomId}
              type="button"
              onClick={() => setSelectedRoom(isSelected ? null : room.roomId)}
              className={`rounded-xl border p-3 text-left transition ${
                isSelected
                  ? "border-teal-500 bg-teal-50 ring-2 ring-teal-500"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{room.name}</span>
                <span className="text-[11px] text-slate-400">{room.capacity}p</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                {room.hasVideoConf && <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-600">Video</span>}
                {room.hasWhiteboard && <span className="rounded bg-purple-50 px-1.5 py-0.5 text-purple-600">Whiteboard</span>}
              </div>
              <div className="mt-2 text-xs">
                {freeSlots > 0 ? (
                  <span className="text-emerald-600 font-medium">{freeSlots} slots free</span>
                ) : (
                  <span className="text-rose-600 font-medium">Fully booked</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">{selected.name} — Time Slots</h3>
            <button
              type="button"
              onClick={() => setSelectedRoom(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIME_SLOTS.map((slot) => {
              const isBooked = selected.bookedSlots.includes(slot);
              const wasJustBooked = justBooked === `${selected.roomId}-${slot}`;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => !isBooked && handleBook(selected.roomId, slot)}
                  disabled={isBooked || booking}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition ${
                    wasJustBooked
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : isBooked
                      ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "border-slate-200 bg-white text-slate-700 hover:border-teal-400 hover:bg-teal-50"
                  }`}
                >
                  {wasJustBooked ? "Booked ✓" : slot}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

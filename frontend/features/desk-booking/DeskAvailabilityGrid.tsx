"use client";
import { useEffect, useState } from "react";
import { deskBookingApi } from "./api";
import type { DeskAvailability } from "./types";

interface Props {
  date: string;
  employeeId: string;
  refresh?: number;
  onBookingCreated: () => void;
  onAvailabilityChange?: (occupied: number, total: number) => void;
}

export default function DeskAvailabilityGrid({ date, employeeId, refresh = 0, onBookingCreated, onAvailabilityChange }: Props) {
  const [desks, setDesks] = useState<DeskAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    deskBookingApi.getAvailability(date)
      .then((data) => {
        setDesks(data);
        onAvailabilityChange?.(data.filter((d) => !d.available).length, data.length);
      })
      .catch((err: any) => {
        setError(err?.message ?? "Unable to load desk availability.");
      })
      .finally(() => setLoading(false));
  }, [date, refresh, onAvailabilityChange]);

  const updateAvailability = (updated: DeskAvailability[]) => {
    setDesks(updated);
    onAvailabilityChange?.(updated.filter((d) => !d.available).length, updated.length);
  };

  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleBook = async (deskId: string) => {
    setBooking(deskId);
    setBookingError(null);
    try {
      await deskBookingApi.createBooking({ deskId, employeeId, date });
      onBookingCreated();
      const updated = await deskBookingApi.getAvailability(date);
      updateAvailability(updated);
    } catch (e: any) {
      setBookingError(e?.message ?? "Unable to create booking.");
      setTimeout(() => setBookingError(null), 5000);
    } finally {
      setBooking(null);
    }
  };

  const floors = [...new Set(desks.map((d) => d.floor))].sort();

  if (loading) return <p className="text-gray-500 py-8 text-center">Loading desks…</p>;
  if (error) return <p className="text-center py-8 text-sm text-rose-600">{error}</p>;

  return (
    <div className="space-y-6">
      {bookingError && (
        <div role="alert" className="flex items-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
          <p className="text-sm font-medium text-rose-800">{bookingError}</p>
          <button type="button" onClick={() => setBookingError(null)} className="ml-auto text-rose-400 hover:text-rose-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
      {floors.map((floor) => (
        <div key={floor}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Floor {floor}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {desks.filter((d) => d.floor === floor).map((desk) => (
              <div
                key={desk.deskId}
                className={`rounded-lg border p-4 flex flex-col gap-2 transition-shadow ${desk.available ? "bg-white border-gray-200 hover:shadow-md" : "bg-gray-50 border-gray-100 opacity-60"}`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{desk.deskLabel}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${desk.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {desk.available ? "Free" : "Booked"}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{desk.zone}</span>
                <div className="flex gap-1.5 flex-wrap">
                  {desk.hasMonitor && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Monitor</span>
                  )}
                  {desk.hasStandingOption && (
                    <span className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">Standing</span>
                  )}
                </div>
                {desk.available && (
                  <button
                    onClick={() => handleBook(desk.deskId)}
                    disabled={booking === desk.deskId}
                    className="mt-1 w-full text-xs bg-teal-600 hover:bg-teal-700 text-white rounded-md py-1.5 font-medium disabled:opacity-50 transition-colors"
                  >
                    {booking === desk.deskId ? "Booking…" : "Book"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

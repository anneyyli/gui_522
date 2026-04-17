"use client";
import { useEffect, useState } from "react";
import { deskBookingApi } from "./api";
import type { DeskAvailability } from "./types";

interface Props {
  date: string;
  employeeId: string;
  onBookingCreated: () => void;
}

export default function DeskAvailabilityGrid({ date, employeeId, onBookingCreated }: Props) {
  const [desks, setDesks] = useState<DeskAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    deskBookingApi.getAvailability(date)
      .then(setDesks)
      .finally(() => setLoading(false));
  }, [date]);

  const handleBook = async (deskId: string) => {
    setBooking(deskId);
    try {
      await deskBookingApi.createBooking({ deskId, employeeId, date });
      onBookingCreated();
      const updated = await deskBookingApi.getAvailability(date);
      setDesks(updated);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBooking(null);
    }
  };

  const floors = [...new Set(desks.map(d => d.floor))].sort();

  if (loading) return <p className="text-gray-500 py-8 text-center">Loading desks…</p>;

  return (
    <div className="space-y-6">
      {floors.map(floor => (
        <div key={floor}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Floor {floor}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {desks.filter(d => d.floor === floor).map(desk => (
              <div
                key={desk.deskId}
                className={`rounded-lg border p-4 flex flex-col gap-2 transition-shadow
                  ${desk.available
                    ? "bg-white border-gray-200 hover:shadow-md"
                    : "bg-gray-50 border-gray-100 opacity-60"}`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{desk.deskLabel}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                    ${desk.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
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
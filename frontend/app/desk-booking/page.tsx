"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StatusLegend from "../components/StatusLegend";
import FloorPlan from "../components/FloorPlan";
import DeskDetailsPanel from "../components/DeskDetailsPanel";
import MyBookings from "../../features/desk-booking/MyBookings";
import { deskBookingApi } from "../../features/desk-booking/api";
import type { BookingResponse, DeskAvailability } from "../../features/desk-booking/types";
import { clearCurrentUser, getCurrentUser, getCurrentUserSession, type CurrentUser } from "@/lib/auth";

const TODAY = new Date().toISOString().slice(0, 10);

export default function DeskBookingPage() {
  const router = useRouter();
  const [date, setDate] = useState(TODAY);
  const [refresh, setRefresh] = useState(0);
  const [desks, setDesks] = useState<DeskAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeskId, setSelectedDeskId] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login?next=/desk-booking");
      return;
    }

    getCurrentUserSession()
      .then((verifiedUser) => {
        if (!verifiedUser) {
          clearCurrentUser();
          router.push("/login?next=/desk-booking");
          return;
        }
        setUser(verifiedUser);
      })
      .finally(() => setIsCheckingAuth(false));
  }, [router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    deskBookingApi
      .getAvailability(date)
      .then((data) => {
        setDesks(data);
        setSelectedDeskId(null);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Unable to load desk availability."))
      .finally(() => setLoading(false));
  }, [date, user, refresh]);

  const occupied = desks.filter((d) => !d.available).length;
  const total = desks.length;
  const percent = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const selectedDesk = useMemo(
    () => desks.find((d) => d.deskId === selectedDeskId) ?? null,
    [desks, selectedDeskId],
  );

  const selectedDateLabel = useMemo(() => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [date]);

  const handleConfirmBooking = async () => {
    if (!selectedDeskId || !user) return;
    setBooking(true);
    try {
      await deskBookingApi.createBooking({ deskId: selectedDeskId, employeeId: user.employeeId, date });
      setSelectedDeskId(null);
      setRefresh((c) => c + 1);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Unable to create booking.");
    } finally {
      setBooking(false);
    }
  };

  const handleBookingCancelled = (cancelledBooking: BookingResponse) => {
    if (cancelledBooking.date.slice(0, 10) === date) {
      setDesks((current) =>
        current.map((desk) =>
          desk.deskId === cancelledBooking.deskId ? { ...desk, available: true } : desk
        )
      );
    }
  };

  if (isCheckingAuth) {
    return <p className="text-center py-20 text-sm text-slate-500">Checking authentication…</p>;
  }

  if (!user) {
    return <p className="text-center py-20 text-sm text-slate-500">Redirecting to login…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-700">Desk Booking</p>
          <h1 className="text-3xl font-semibold text-slate-900">Birmingham Office</h1>
          <p className="mt-1 text-sm text-slate-600">Select a date to view availability and book desks for your team.</p>
          {desks.length > 0 && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15" />
              </svg>
              Floor {desks[0]?.floor || "1"} · {desks[0]?.zone || "Open Plan"}
            </span>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <div className="font-medium text-slate-900">Selected date</div>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
            />
          </div>
          <div className="mt-2 text-slate-500">{selectedDateLabel}</div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Live Occupancy</h2>
            <p className="text-sm text-slate-500">Current desk occupancy for the selected date.</p>
          </div>
          <span className="text-sm font-medium text-slate-700">{occupied}/{total} Desks · {percent}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all ${percent >= 80 ? "bg-amber-500" : "bg-teal-600"}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </section>

      <StatusLegend />

      {loading ? (
        <p className="text-center py-8 text-sm text-slate-500">Loading desks…</p>
      ) : error ? (
        <p className="text-center py-8 text-sm text-rose-600">{error}</p>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <FloorPlan
            desks={desks}
            selectedDeskId={selectedDeskId}
            onSelectDesk={setSelectedDeskId}
          />

          <div className="space-y-6">
            {selectedDesk ? (
              <DeskDetailsPanel
                desk={selectedDesk}
                isBooking={booking}
                onConfirm={handleConfirmBooking}
                onDeselect={() => setSelectedDeskId(null)}
              />
            ) : (
              <aside className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <p className="text-sm text-slate-500">Select an available desk from the floor plan to view details and book.</p>
              </aside>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">My bookings</h2>
                <p className="text-sm text-slate-500">Manage your upcoming desk reservations.</p>
              </div>
              <MyBookings employeeId={user.employeeId} refresh={refresh} onCancelled={handleBookingCancelled} />
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

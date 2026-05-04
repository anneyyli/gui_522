"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import StatusLegend from "../components/StatusLegend";
import DeskAvailabilityGrid from "../../features/desk-booking/DeskAvailabilityGrid";
import MyBookings from "../../features/desk-booking/MyBookings";
import { clearCurrentUser, getCurrentUser, getCurrentUserSession, type CurrentUser } from "@/lib/auth";

const TODAY = new Date().toISOString().slice(0, 10);

export default function DeskBookingPage() {
  const router = useRouter();
  const [date, setDate] = useState(TODAY);
  const [refresh, setRefresh] = useState(0);
  const [occupied, setOccupied] = useState(0);
  const [total, setTotal] = useState(0);
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

  const percent = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const selectedDateLabel = useMemo(() => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [date]);

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
          <h1 className="text-3xl font-semibold text-slate-900">Floor 4 - Engineering</h1>
          <p className="mt-1 text-sm text-slate-600">Browse available desks, book for the day, and manage your schedule.</p>
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
            <h2 className="text-lg font-semibold text-slate-900">Occupancy</h2>
            <p className="text-sm text-slate-500">Current desk occupancy for the selected date.</p>
          </div>
          <span className="text-sm text-slate-500">{occupied} of {total} desks taken ({percent}%)</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-teal-600" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <StatusLegend />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Available desks</h2>
            <p className="mt-1 text-sm text-slate-500">Book a desk for the selected date and review availability by floor.</p>
          </div>
          <DeskAvailabilityGrid
            date={date}
            employeeId={user.employeeId}
            onBookingCreated={() => setRefresh((current) => current + 1)}
            onAvailabilityChange={(occupiedCount, totalCount) => {
              setOccupied(occupiedCount);
              setTotal(totalCount);
            }}
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">My bookings</h2>
              <p className="text-sm text-slate-500">Manage upcoming bookings for your employee account.</p>
            </div>
          </div>
          <MyBookings employeeId={user.employeeId} refresh={refresh} />
        </section>
      </div>
    </div>
  );
}

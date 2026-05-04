"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FloorPlan from "../components/FloorPlan";
import DeskDetailsPanel from "../components/DeskDetailsPanel";
import MyBookings from "../../features/desk-booking/MyBookings";
import { deskBookingApi } from "../../features/desk-booking/api";
import type { BookingResponse, DeskAvailability } from "../../features/desk-booking/types";
import RoomBookingSection from "../../features/room-booking/RoomBookingSection";
import { clearCurrentUser, getCurrentUser, getCurrentUserSession, type CurrentUser } from "@/lib/auth";

const TODAY = new Date().toISOString().slice(0, 10);

type Tab = "desks" | "rooms";

export default function DeskBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "rooms" ? "rooms" : "desks";
  const [tab, setTab] = useState<Tab>(initialTab);

  const switchTab = (newTab: Tab) => {
    setTab(newTab);
    const url = newTab === "rooms" ? "/desk-booking?tab=rooms" : "/desk-booking";
    window.history.replaceState(null, "", url);
  };
  const [date, setDate] = useState(TODAY);
  const [selectedFloor, setSelectedFloor] = useState("1");
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

  const floorDesks = desks.filter((d) => d.floor === selectedFloor);
  const occupied = floorDesks.filter((d) => !d.available).length;
  const total = floorDesks.length;
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
          <p className="text-sm font-medium text-teal-700">Space Booking</p>
          <h1 className="text-3xl font-bold text-slate-900">Birmingham Office</h1>
          <p className="mt-1 text-sm text-slate-500">Book desks and meeting rooms for the day.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <div className="font-medium text-slate-900">Date</div>
          <div className="mt-1">
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
            />
          </div>
          <div className="mt-1.5 text-xs text-slate-400">{selectedDateLabel}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => switchTab("desks")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            tab === "desks"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
            </svg>
            Desks
          </span>
        </button>
        <button
          type="button"
          onClick={() => switchTab("rooms")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            tab === "rooms"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
            Meeting Rooms
          </span>
        </button>
      </div>

      {/* Desks tab */}
      {tab === "desks" && (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Desk Occupancy</h2>
                <p className="text-sm text-slate-500">
                  {selectedFloor === "1" ? "Ground Floor" : `Floor ${selectedFloor}`} · {occupied} of {total} desks in use
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                percent >= 80 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {percent}%
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${percent >= 80 ? "bg-amber-500" : "bg-teal-500"}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </section>

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
                selectedFloor={selectedFloor}
                onSelectFloor={setSelectedFloor}
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
                    <h2 className="text-lg font-semibold text-slate-900">My Desk Bookings</h2>
                    <p className="text-sm text-slate-500">Your upcoming desk reservations.</p>
                  </div>
                  <MyBookings employeeId={user.employeeId} refresh={refresh} onCancelled={handleBookingCancelled} filter="desks" />
                </section>
              </div>
            </div>
          )}
        </>
      )}

      {/* Meeting Rooms tab */}
      {tab === "rooms" && (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <RoomBookingSection date={date} employeeId={user.employeeId} onBooked={() => setRefresh((c) => c + 1)} refresh={refresh} />
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm h-fit">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">My Room Bookings</h2>
              <p className="text-sm text-slate-500">Your upcoming room reservations.</p>
            </div>
            <MyBookings employeeId={user.employeeId} refresh={refresh} onCancelled={handleBookingCancelled} onRoomCancelled={() => setRefresh((c) => c + 1)} filter="rooms" />
          </section>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import FloorPlan from "../components/FloorPlan";
import DeskDetailsPanel from "../components/DeskDetailsPanel";
import StatusLegend from "../components/StatusLegend";

const desks = [
  { id: "4-B01", x: 0, y: 0, status: "BOOKED", initials: "CW", label: "4-B01" },
  { id: "4-B02", x: 1, y: 0, status: "AVAILABLE", initials: "", label: "4-B02" },
  { id: "4-B03", x: 2, y: 0, status: "UNAVAILABLE", initials: "", label: "4-B03" },
  { id: "4-B04", x: 0, y: 1, status: "TEAM_BOOKED", initials: "AJ", label: "4-B04" },
  { id: "4-B05", x: 1, y: 1, status: "AVAILABLE", initials: "", label: "4-B05" },
  { id: "4-B06", x: 2, y: 1, status: "BOOKED", initials: "DS", label: "4-B06" },
];

export default function DeskBookingPage() {
  const [selectedDesk, setSelectedDesk] = useState("4-B05");
  const occupied = 32;
  const total = 50;
  const percent = Math.round((occupied / total) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-700">Desk Booking</p>
          <h1 className="text-3xl font-semibold text-slate-900">Floor 4 - Engineering</h1>
          <p className="mt-1 text-sm text-slate-600">Select a desk from the visual floor plan and confirm the booking.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <div className="font-medium text-slate-900">Selected date</div>
          <div>Wednesday, 2026-05-06</div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Occupancy</h2>
          <span className="text-sm text-slate-500">{occupied} of {total} desks taken ({percent}%)</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-teal-600" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <StatusLegend />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <FloorPlan desks={desks} selectedDesk={selectedDesk} onSelectDesk={setSelectedDesk} />
        <DeskDetailsPanel deskId={selectedDesk} />
      </div>
    </div>
  );
}

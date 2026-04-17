"use client";
import { useState } from "react";
import TeamWeekView from "@/features/team-scheduling/TeamWeekView";
import ScheduleForm from "@/features/team-scheduling/ScheduleForm";

function getMonday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

export default function TeamSchedulingPage() {
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Team Schedule</h1>
        <p className="text-gray-500 mt-1 text-sm">View and plan your team's hybrid working week.</p>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Week of</label>
        <input
          type="date"
          value={weekStart}
          onChange={e => setWeekStart(getMonday(new Date(e.target.value)))}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-medium text-gray-800 mb-4">Team This Week</h2>
          <TeamWeekView weekStart={weekStart} refresh={refresh} />
        </div>
        <div>
          <ScheduleForm onScheduleSet={() => setRefresh(r => r + 1)} />
        </div>
      </div>
    </div>
  );
}
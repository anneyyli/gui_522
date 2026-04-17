"use client";
import { useEffect, useState } from "react";
import { teamSchedulingApi } from "./api";
import type { TeamWeekResponse } from "./types";

const modeStyles: Record<string, string> = {
  OFFICE: "bg-teal-100 text-teal-700",
  REMOTE: "bg-blue-100 text-blue-700",
  LEAVE: "bg-amber-100 text-amber-700",
};

interface Props { weekStart: string; refresh: number; }

export default function TeamWeekView({ weekStart, refresh }: Props) {
  const [data, setData] = useState<TeamWeekResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    teamSchedulingApi.getTeamWeek(weekStart)
      .then(setData)
      .finally(() => setLoading(false));
  }, [weekStart, refresh]);

  if (loading) return <p className="text-gray-500 py-8 text-center">Loading team schedule…</p>;
  if (!data.length) return <p className="text-gray-400 text-sm py-4">No schedule data for this week.</p>;

  return (
    <div className="space-y-6">
      {data.map(dept => (
        <div key={dept.department}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {dept.department}
          </h3>
          <div className="space-y-2">
            {dept.entries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div>
                  <p className="font-medium text-sm">{entry.employeeName}</p>
                  <p className="text-xs text-gray-500">{entry.date}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${modeStyles[entry.workMode]}`}>
                  {entry.workMode}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
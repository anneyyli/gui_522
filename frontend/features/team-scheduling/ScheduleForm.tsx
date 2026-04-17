"use client";
import { useState } from "react";
import { teamSchedulingApi } from "./api";

const EMPLOYEES = [
  { id: "E001", name: "Alice Johnson" },
  { id: "E002", name: "Bob Smith" },
  { id: "E003", name: "Carol White" },
  { id: "E004", name: "Dan Brown" },
  { id: "E005", name: "Eve Davis" },
];

interface Props { onScheduleSet: () => void; }

export default function ScheduleForm({ onScheduleSet }: Props) {
  const [employeeId, setEmployeeId] = useState("E001");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [workMode, setWorkMode] = useState<"OFFICE" | "REMOTE" | "LEAVE">("OFFICE");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await teamSchedulingApi.setSchedule({ employeeId, date, workMode });
      onScheduleSet();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-gray-800">Set Work Mode</h3>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Employee</label>
        <select
          value={employeeId}
          onChange={e => setEmployeeId(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {EMPLOYEES.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-600">Work Mode</label>
        <div className="flex gap-2">
          {(["OFFICE", "REMOTE", "LEAVE"] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setWorkMode(mode)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors
                ${workMode === mode
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-300"}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-50 transition-colors"
      >
        {submitting ? "Saving…" : "Save Schedule"}
      </button>
    </form>
  );
}
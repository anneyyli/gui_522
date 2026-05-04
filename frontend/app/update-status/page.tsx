"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getCurrentUserSession, type CurrentUser } from "@/lib/auth";
import { teamSchedulingApi } from "@/features/team-scheduling/api";
import type { ScheduleEntry } from "@/features/team-scheduling/types";

const WORK_MODES = [
  { value: "OFFICE" as const, label: "In Office", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "REMOTE" as const, label: "Remote", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "LEAVE" as const, label: "Out of Office", color: "bg-rose-100 text-rose-700 border-rose-200" },
];

function getWeekDates(): string[] {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function formatDay(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function UpdateStatusPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [schedule, setSchedule] = useState<Record<string, ScheduleEntry["workMode"] | null>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const weekDates = getWeekDates();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login?next=/update-status");
      return;
    }

    getCurrentUserSession().then((verified) => {
      if (!verified) {
        router.push("/login?next=/update-status");
        return;
      }
      setUser(verified);

      teamSchedulingApi.getEmployeeSchedule(verified.employeeId).then((entries) => {
        const map: Record<string, ScheduleEntry["workMode"]> = {};
        entries.forEach((e) => { map[e.date] = e.workMode; });
        setSchedule(map);
      });
    });
  }, [router]);

  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  const handleSetStatus = async (date: string, workMode: ScheduleEntry["workMode"]) => {
    if (!user) return;
    setSaving(date);
    try {
      await teamSchedulingApi.setSchedule({ employeeId: user.employeeId, date, workMode });
      setSchedule((current) => ({ ...current, [date]: workMode }));
      setSaved(date);
      const label = WORK_MODES.find(m => m.value === workMode)?.label ?? workMode;
      setConfirmationMessage(`Status updated: ${formatDay(date)} set to "${label}"`);
      setTimeout(() => { setSaved(null); setConfirmationMessage(null); }, 4000);
    } catch {
      setConfirmationMessage(null);
      setError("Unable to save your status — the server may be temporarily unavailable. Check your connection and try again, or contact your workspace administrator if the problem persists.");
    } finally {
      setSaving(null);
    }
  };

  if (!user) {
    return <p className="text-center py-20 text-sm text-slate-500">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">Update Status</p>
        <h1 className="text-3xl font-semibold text-slate-900">My Working Status</h1>
        <p className="mt-1 text-sm text-slate-600">Set your working location for each day this week so your team knows where you are.</p>
      </div>

      {confirmationMessage && (
        <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
          <svg className="h-5 w-5 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="text-sm font-medium text-emerald-800">{confirmationMessage}</p>
        </div>
      )}

      {error && (
        <div role="alert" className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 shadow-sm">
          <svg className="h-5 w-5 flex-shrink-0 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5.217 3.374 1.948 3.374H2.697c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0L22.303 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="text-sm font-medium text-rose-800">{error}</p>
          <button type="button" onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div className="space-y-3">
        {weekDates.map((date) => {
          const currentMode = schedule[date] ?? null;
          const isSaving = saving === date;
          const justSaved = saved === date;

          return (
            <section key={date} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">{formatDay(date)}</span>
                  {currentMode && (
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${WORK_MODES.find(m => m.value === currentMode)?.color}`}>
                      {WORK_MODES.find(m => m.value === currentMode)?.label}
                    </span>
                  )}
                  {justSaved && <span className="text-xs text-emerald-600 font-medium">Saved</span>}
                </div>

                <div className="flex gap-2">
                  {WORK_MODES.map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => handleSetStatus(date, mode.value)}
                      disabled={isSaving}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition disabled:opacity-50 ${
                        currentMode === mode.value
                          ? `${mode.color} ring-2 ring-offset-1 ring-teal-500`
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

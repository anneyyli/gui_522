"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getCurrentUserSession, type CurrentUser } from "@/lib/auth";
import { teamSchedulingApi } from "@/features/team-scheduling/api";
import type { ScheduleEntry } from "@/features/team-scheduling/types";

const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri"];

interface DayAnalysis {
  date: string;
  dayLabel: string;
  officeCount: number;
  remoteCount: number;
  leaveCount: number;
  pendingCount: number;
  totalMembers: number;
}

export default function PlanTeamDayPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [days, setDays] = useState<DayAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduling, setScheduling] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login?next=/plan-team-day");
      return;
    }

    getCurrentUserSession().then((verified) => {
      if (!verified) {
        router.push("/login?next=/plan-team-day");
        return;
      }
      setUser(verified);
    });
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchWeekData = async () => {
      try {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
        const weekStart = monday.toISOString().slice(0, 10);

        const data = await teamSchedulingApi.getTeamWeek(weekStart);

        // Collect all unique team members
        const members = new Set<string>();
        data.forEach(dept => {
          dept.entries.forEach(entry => members.add(entry.employeeId));
        });
        const memberIds = Array.from(members);
        setTeamMembers(memberIds);

        // Build per-day analysis
        const weekDays: DayAnalysis[] = [];
        for (let i = 0; i < 5; i++) {
          const date = new Date(monday);
          date.setDate(monday.getDate() + i);
          const dateStr = date.toISOString().slice(0, 10);

          let officeCount = 0;
          let remoteCount = 0;
          let leaveCount = 0;

          data.forEach(dept => {
            dept.entries.forEach(entry => {
              if (entry.date === dateStr) {
                if (entry.workMode === "OFFICE") officeCount++;
                else if (entry.workMode === "REMOTE") remoteCount++;
                else if (entry.workMode === "LEAVE") leaveCount++;
              }
            });
          });

          const scheduledCount = officeCount + remoteCount + leaveCount;
          const pendingCount = Math.max(0, memberIds.length - scheduledCount);

          weekDays.push({
            date: dateStr,
            dayLabel: DAY_LABELS[i],
            officeCount,
            remoteCount,
            leaveCount,
            pendingCount,
            totalMembers: memberIds.length,
          });
        }

        setDays(weekDays);
      } catch {
        // Fallback with empty data
        setDays([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWeekData();
  }, [user]);

  const bestDay = days.length > 0
    ? days.reduce((best, day) => {
        // Best day = most already in office + most pending (flexible), least on leave
        const score = day.officeCount * 2 + day.pendingCount - day.leaveCount * 3;
        const bestScore = best.officeCount * 2 + best.pendingCount - best.leaveCount * 3;
        return score > bestScore ? day : best;
      })
    : null;

  const handleScheduleTeamDay = async () => {
    if (!selectedDay || !user || teamMembers.length === 0) return;
    setScheduling(true);

    try {
      // Schedule all team members who don't already have OFFICE or LEAVE for this day
      const dayData = days.find(d => d.date === selectedDay);
      const promises = teamMembers.map(memberId =>
        teamSchedulingApi.setSchedule({
          employeeId: memberId,
          date: selectedDay,
          workMode: "OFFICE",
        })
      );

      await Promise.all(promises);
      const dayLabel = dayData?.dayLabel ?? selectedDay;
      setSuccess(`Team day scheduled for ${dayLabel}! All ${teamMembers.length} members set to in-office.`);
      setSelectedDay(null);

      // Refresh data
      const today = new Date();
      const monday = new Date(today);
      monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      const weekStart = monday.toISOString().slice(0, 10);
      const data = await teamSchedulingApi.getTeamWeek(weekStart);

      const weekDays: DayAnalysis[] = [];
      for (let i = 0; i < 5; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        const dateStr = date.toISOString().slice(0, 10);

        let officeCount = 0;
        let remoteCount = 0;
        let leaveCount = 0;

        data.forEach(dept => {
          dept.entries.forEach(entry => {
            if (entry.date === dateStr) {
              if (entry.workMode === "OFFICE") officeCount++;
              else if (entry.workMode === "REMOTE") remoteCount++;
              else if (entry.workMode === "LEAVE") leaveCount++;
            }
          });
        });

        const scheduledCount = officeCount + remoteCount + leaveCount;
        const pendingCount = Math.max(0, teamMembers.length - scheduledCount);

        weekDays.push({
          date: dateStr,
          dayLabel: DAY_LABELS[i],
          officeCount,
          remoteCount,
          leaveCount,
          pendingCount,
          totalMembers: teamMembers.length,
        });
      }
      setDays(weekDays);
    } catch {
      setError("Failed to schedule team day. Please try again.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <svg className="h-5 w-5 animate-spin text-teal-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Analysing team schedules...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-700">Team Coordination</p>
          <h1 className="text-3xl font-semibold text-slate-900">Plan Team Day</h1>
          <p className="mt-1 text-sm text-slate-600">
            Find the best day for your team to be in the office together. Pick a day and schedule everyone in one click.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/team-scheduling")}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          View full schedule
        </button>
      </div>

      {success && (
        <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm">
          <svg className="h-5 w-5 flex-shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="text-sm font-medium text-emerald-800">{success}</p>
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

      {bestDay && (
        <section className="rounded-2xl border border-teal-200 bg-teal-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-teal-800">Recommended: {bestDay.dayLabel}</h3>
              <p className="mt-0.5 text-sm text-teal-700">
                {bestDay.officeCount} team member{bestDay.officeCount !== 1 ? "s" : ""} already in office
                {bestDay.pendingCount > 0 && `, ${bestDay.pendingCount} haven't decided yet`}
                {bestDay.leaveCount > 0 && `, only ${bestDay.leaveCount} on leave`}.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">This Week&apos;s Availability</h2>
          <p className="text-sm text-slate-500">
            {teamMembers.length} team member{teamMembers.length !== 1 ? "s" : ""} — select the day you want everyone in office.
          </p>
        </div>

        {days.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No schedule data found. Ask team members to update their status first.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-5">
            {days.map((day) => {
              const isSelected = selectedDay === day.date;
              const isBest = bestDay?.date === day.date;
              const officePercent = day.totalMembers > 0 ? Math.round((day.officeCount / day.totalMembers) * 100) : 0;

              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => setSelectedDay(isSelected ? null : day.date)}
                  className={`relative flex flex-col items-center rounded-xl border-2 p-4 transition ${
                    isSelected
                      ? "border-teal-600 bg-teal-50 ring-2 ring-teal-200"
                      : isBest
                      ? "border-teal-300 bg-white hover:border-teal-400"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {isBest && (
                    <span className="absolute -top-2.5 rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      BEST
                    </span>
                  )}
                  <span className="text-sm font-semibold text-slate-900">{DAY_SHORT[days.indexOf(day)]}</span>
                  <span className="mt-0.5 text-[11px] text-slate-400">{day.date.slice(5)}</span>

                  {/* Stacked bar */}
                  <div className="mt-3 h-20 w-6 overflow-hidden rounded-full bg-slate-100">
                    <div className="flex h-full flex-col-reverse">
                      {day.officeCount > 0 && (
                        <div
                          className="w-full bg-emerald-400 transition-all"
                          style={{ height: `${(day.officeCount / day.totalMembers) * 100}%` }}
                        />
                      )}
                      {day.remoteCount > 0 && (
                        <div
                          className="w-full bg-blue-400 transition-all"
                          style={{ height: `${(day.remoteCount / day.totalMembers) * 100}%` }}
                        />
                      )}
                      {day.leaveCount > 0 && (
                        <div
                          className="w-full bg-rose-400 transition-all"
                          style={{ height: `${(day.leaveCount / day.totalMembers) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-2 text-center">
                    <span className="text-lg font-bold text-emerald-700">{day.officeCount}</span>
                    <span className="text-xs text-slate-400">/{day.totalMembers}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">in office</span>

                  {day.leaveCount > 0 && (
                    <span className="mt-1 text-[10px] text-rose-500">{day.leaveCount} on leave</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />
            <span className="text-[11px] text-slate-500">In Office</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-blue-400" />
            <span className="text-[11px] text-slate-500">Remote</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-rose-400" />
            <span className="text-[11px] text-slate-500">On Leave</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-slate-200" />
            <span className="text-[11px] text-slate-500">Pending</span>
          </div>
        </div>
      </section>

      {selectedDay && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Schedule team for {days.find(d => d.date === selectedDay)?.dayLabel}
              </h3>
              <p className="text-sm text-slate-500">
                This will set all {teamMembers.length} team members to &quot;In Office&quot; for {selectedDay}.
              </p>
            </div>
            <button
              type="button"
              onClick={handleScheduleTeamDay}
              disabled={scheduling}
              className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {scheduling ? "Scheduling..." : "Confirm Team Day"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

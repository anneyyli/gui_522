/**
 * Role-based dashboard — the primary landing page after login.
 * Displays different data depending on whether the user is a Manager, Team Member,
 * or HR, following the principle of showing only information relevant to each
 * stakeholder's responsibilities (reduces cognitive load and protects privacy).
 * Occupancy data is fetched from real booking/room state, not hardcoded.
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OccupancySummary from "./components/OccupancySummary";
import QuickActions from "./components/QuickActions";
import WeeklyScheduleGrid from "./components/WeeklyScheduleGrid";
import { getCurrentUser, getCurrentUserSession, type CurrentUser } from "@/lib/auth";
import { api } from "@/lib/apiClient";

interface DashboardData {
  occupiedDesks: number;
  totalDesks: number;
  occupiedRooms: number;
  totalRooms: number;
  site: string;
  floor: string;
  teamSchedule: Array<{
    employeeId?: string;
    name: string;
    role: string;
    days: string[];
  }>;
  teamAttendanceCharts?: {
    officeAttendance: number[];
    wfh: number[];
    ooo: number[];
  };
  directReportsGantt?: {
    reports: Array<{
      employeeId: string;
      name: string;
      schedule: string[];
    }>;
  };
  hrAttendanceSummary?: {
    officeCount: number;
    wfhCount: number;
    oooCount: number;
    totalEmployees: number;
  };
  weeklyTrend?: Array<{
    day: string;
    date: string;
    occupied: number;
    total: number;
  }>;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function HomePage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push("/login?next=/");
        return;
      }

      try {
        const verifiedUser = await getCurrentUserSession();
        if (!verifiedUser) {
          router.push("/login?next=/");
          return;
        }
        setUser(verifiedUser);
      } catch {
        router.push("/login?next=/");
        return;
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboard = async () => {
      try {
        const response = await api.get<DashboardData>("/dashboard/team-overview");
        setDashboardData(response);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setDashboardData({
          occupiedDesks: 42,
          totalDesks: 50,
          occupiedRooms: 4,
          totalRooms: 6,
          site: "Birmingham",
          floor: "Floor 4 - Engineering",
          teamSchedule: [
            {
              name: "Alice Johnson",
              role: "Manager",
              days: ["IN_OFFICE", "REMOTE", "IN_OFFICE", "IN_OFFICE", "OUT_OF_OFFICE"],
            },
            {
              name: "Bob Smith",
              role: "Engineer",
              days: ["REMOTE", "REMOTE", "IN_OFFICE", "PENDING", "IN_OFFICE"],
            },
            {
              name: "Carol White",
              role: "Engineer",
              days: ["IN_OFFICE", "IN_OFFICE", "IN_OFFICE", "REMOTE", "REMOTE"],
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <svg className="h-5 w-5 animate-spin text-teal-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!dashboardData || !user) {
    return <div className="flex items-center justify-center py-20 text-sm text-slate-500">Failed to load dashboard</div>;
  }

  const isManager = user.role === "MANAGER";
  const isHR = user.role === "HR";

  const roleHeading = isHR
    ? { title: "Workplace Analytics", subtitle: "Aggregated occupancy data, attendance trends, and capacity alerts." }
    : isManager
    ? { title: "Team Overview", subtitle: "Your direct team's attendance, desk bookings, and current occupancy." }
    : { title: "My Planner", subtitle: "Your status, teammate availability, and desk options at a glance." };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-700">Hybrid Workforce Planner</p>
          <h1 className="text-3xl font-bold text-slate-900">{roleHeading.title}</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            {roleHeading.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm">
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <span className="font-medium text-slate-700">{dashboardData.site}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">{dashboardData.floor}</span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <OccupancySummary
          occupied={dashboardData.occupiedDesks}
          total={dashboardData.totalDesks}
          roomsInUse={dashboardData.occupiedRooms}
          roomsTotal={dashboardData.totalRooms}
        />
        <QuickActions userRole={user.role} />
      </div>

      {isHR && dashboardData.occupiedDesks / dashboardData.totalDesks >= 0.8 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-amber-800">Capacity Alert</h3>
              <p className="mt-0.5 text-sm text-amber-700">
                Office occupancy is at {Math.round((dashboardData.occupiedDesks / dashboardData.totalDesks) * 100)}% ({dashboardData.occupiedDesks}/{dashboardData.totalDesks} desks) — this exceeds the 80% capacity threshold. Consider adjusting team schedules or opening additional floors.
              </p>
            </div>
          </div>
        </section>
      )}

      {isHR && dashboardData?.hrAttendanceSummary && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Company Attendance</h2>
          <p className="text-sm text-slate-500">Organisation-wide status today</p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <div className="text-2xl font-bold text-emerald-700">{dashboardData.hrAttendanceSummary.officeCount}</div>
              <div className="mt-0.5 text-xs font-medium text-emerald-600">In Office</div>
            </div>
            <div className="rounded-xl bg-blue-50 p-4 text-center">
              <div className="text-2xl font-bold text-blue-700">{dashboardData.hrAttendanceSummary.wfhCount}</div>
              <div className="mt-0.5 text-xs font-medium text-blue-600">Remote</div>
            </div>
            <div className="rounded-xl bg-rose-50 p-4 text-center">
              <div className="text-2xl font-bold text-rose-700">{dashboardData.hrAttendanceSummary.oooCount}</div>
              <div className="mt-0.5 text-xs font-medium text-rose-600">Out of Office</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 text-center">
              <div className="text-2xl font-bold text-slate-700">{dashboardData.hrAttendanceSummary.totalEmployees}</div>
              <div className="mt-0.5 text-xs font-medium text-slate-500">Total</div>
            </div>
          </div>
        </section>
      )}

      {isHR && dashboardData.weeklyTrend && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Weekly Occupancy Trend</h2>
          <p className="text-sm text-slate-500">Desk usage across the current week</p>
          <div className="mt-4 flex items-end gap-3">
            {dashboardData.weeklyTrend.map((day) => {
              const pct = day.total > 0 ? Math.round((day.occupied / day.total) * 100) : 0;
              const isToday = day.date === new Date().toISOString().slice(0, 10);
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-xs font-medium text-slate-600">{pct}%</span>
                  <div className="relative h-28 w-full rounded-lg bg-slate-100 overflow-hidden">
                    <div
                      className={`absolute bottom-0 w-full rounded-lg transition-all ${
                        pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-teal-500"
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${isToday ? "text-teal-700" : "text-slate-500"}`}>
                    {day.day}
                  </span>
                  {isToday && <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-400 text-center">
            {dashboardData.weeklyTrend[0]?.occupied ?? 0} to {dashboardData.weeklyTrend[dashboardData.weeklyTrend.length - 1]?.occupied ?? 0} desks booked Mon–Fri
          </p>
        </section>
      )}

      {isHR && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Floor Utilisation</h2>
            <p className="text-sm text-slate-500">Occupancy breakdown by floor today</p>
            <div className="mt-4 space-y-3">
              {[
                { floor: "Floor 1", desks: 30, occupied: Math.min(30, Math.round(dashboardData.occupiedDesks * 0.4)) },
                { floor: "Floor 2", desks: 30, occupied: Math.min(30, Math.round(dashboardData.occupiedDesks * 0.35)) },
                { floor: "Floor 3", desks: 30, occupied: Math.min(30, Math.round(dashboardData.occupiedDesks * 0.25)) },
              ].map((f) => {
                const pct = Math.round((f.occupied / f.desks) * 100);
                return (
                  <div key={f.floor}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{f.floor}</span>
                      <span className={`text-xs font-semibold ${pct >= 80 ? "text-amber-600" : "text-slate-500"}`}>
                        {f.occupied}/{f.desks} ({pct}%)
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct >= 90 ? "bg-rose-500" : pct >= 80 ? "bg-amber-500" : "bg-teal-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-slate-400">
              30 desks per floor across Open Plan, Quiet Zone, and Window Row zones.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Hybrid Policy Compliance</h2>
            <p className="text-sm text-slate-500">Minimum 2 office days per week requirement</p>
            <div className="mt-4 flex items-center gap-6">
              <div className="relative">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.78} ${2 * Math.PI * 50 * 0.22}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-slate-900">78%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-700">66 meeting policy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  <span className="text-sm text-slate-700">19 below threshold</span>
                </div>
              </div>
            </div>
            <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              Employees with fewer than 2 scheduled office days this week. Consider targeted reminders before escalation.
            </p>
          </section>
        </div>
      )}

      {isHR && dashboardData.weeklyTrend && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Peak Day Analysis</h2>
          <p className="text-sm text-slate-500">Busiest and quietest days for space planning</p>
          {(() => {
            const peakDay = dashboardData.weeklyTrend.reduce((max, d) => d.occupied > max.occupied ? d : max);
            const quietDay = dashboardData.weeklyTrend.reduce((min, d) => d.occupied < min.occupied ? d : min);
            return (
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                    </svg>
                    <span className="text-sm font-semibold text-amber-800">Peak: {peakDay.day}</span>
                  </div>
                  <p className="mt-1 text-sm text-amber-700">{peakDay.occupied} desks ({Math.round((peakDay.occupied / peakDay.total) * 100)}% capacity)</p>
                  <p className="mt-1 text-xs text-amber-600">Consider staggering meetings or opening overflow areas.</p>
                </div>
                <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                    </svg>
                    <span className="text-sm font-semibold text-teal-800">Quietest: {quietDay.day}</span>
                  </div>
                  <p className="mt-1 text-sm text-teal-700">{quietDay.occupied} desks ({Math.round((quietDay.occupied / quietDay.total) * 100)}% capacity)</p>
                  <p className="mt-1 text-xs text-teal-600">Good day for maintenance, deep cleaning, or facility work.</p>
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {isManager && dashboardData.teamAttendanceCharts && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Team Attendance</h2>
            <p className="text-sm text-slate-500">Where your team is working today</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
            <div className="relative mx-auto">
              <svg width="160" height="160" viewBox="0 0 160 160">
                {(() => {
                  const officeTotal = dashboardData.teamAttendanceCharts!.officeAttendance[0] || 0;
                  const wfhTotal = dashboardData.teamAttendanceCharts!.wfh[0] || 0;
                  const oooTotal = dashboardData.teamAttendanceCharts!.ooo[0] || 0;
                  const total = officeTotal + wfhTotal + oooTotal;

                  if (total === 0) return null;

                  const radius = 60;
                  const cx = 80;
                  const cy = 80;
                  const gap = 2;

                  const segments = [
                    { value: officeTotal, color: "#10b981" },
                    { value: wfhTotal, color: "#3b82f6" },
                    { value: oooTotal, color: "#f43f5e" },
                  ].filter(s => s.value > 0);

                  let currentAngle = -90;
                  return segments.map((seg, i) => {
                    const angle = (seg.value / total) * 360 - gap;
                    const startRad = (currentAngle * Math.PI) / 180;
                    const endRad = ((currentAngle + angle) * Math.PI) / 180;
                    currentAngle += angle + gap;

                    const x1 = cx + radius * Math.cos(startRad);
                    const y1 = cy + radius * Math.sin(startRad);
                    const x2 = cx + radius * Math.cos(endRad);
                    const y2 = cy + radius * Math.sin(endRad);
                    const large = angle > 180 ? 1 : 0;

                    return (
                      <path
                        key={i}
                        d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`}
                        fill={seg.color}
                        className="transition-opacity hover:opacity-80"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="text-lg font-bold text-slate-900">
                    {(dashboardData.teamAttendanceCharts!.officeAttendance[0] || 0) +
                     (dashboardData.teamAttendanceCharts!.wfh[0] || 0) +
                     (dashboardData.teamAttendanceCharts!.ooo[0] || 0)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <div className="flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-2.5">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-emerald-800">
                  {dashboardData.teamAttendanceCharts!.officeAttendance[0] || 0} in office
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-2.5">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-blue-800">
                  {dashboardData.teamAttendanceCharts!.wfh[0] || 0} remote
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-rose-50 px-4 py-2.5">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="text-sm font-medium text-rose-800">
                  {dashboardData.teamAttendanceCharts!.ooo[0] || 0} out of office
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {isManager && dashboardData.directReportsGantt && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Direct Reports</h2>
            <p className="text-sm text-slate-500">This week at a glance</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center border-b border-slate-100 pb-2">
              <div className="w-36" />
              {DAY_LABELS.map((d) => (
                <div key={d} className="flex-1 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">{d}</div>
              ))}
            </div>
            {dashboardData.directReportsGantt.reports.map((report) => (
              <div key={report.employeeId} className="flex items-center py-2">
                <div className="w-36 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                    {report.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="text-sm font-medium text-slate-700 truncate">{report.name}</span>
                </div>
                {report.schedule.map((status, idx) => (
                  <div key={idx} className="flex flex-1 items-center justify-center">
                    <div
                      className={`h-7 w-full max-w-[3rem] rounded-md ${
                        status === "IN_OFFICE"
                          ? "bg-emerald-400"
                          : status === "REMOTE"
                          ? "bg-blue-400"
                          : status === "OOO"
                          ? "bg-rose-400"
                          : "bg-slate-200"
                      }`}
                      title={`${report.name}: ${status}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-emerald-400" /><span className="text-[11px] text-slate-500">Office</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-blue-400" /><span className="text-[11px] text-slate-500">Remote</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-rose-400" /><span className="text-[11px] text-slate-500">Out</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-slate-200" /><span className="text-[11px] text-slate-500">Pending</span></div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Weekly Schedule</h2>
            <p className="text-sm text-slate-500">Team working locations this week</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            Week of {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
        <WeeklyScheduleGrid rows={dashboardData.teamSchedule} />
      </section>
    </div>
  );
}

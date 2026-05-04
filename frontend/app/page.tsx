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
}

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
        // Fallback to mock data
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
    return <div className="flex items-center justify-center py-20">Loading dashboard...</div>;
  }

  if (!dashboardData || !user) {
    return <div className="flex items-center justify-center py-20">Failed to load dashboard</div>;
  }

  const isManager = user.role === "MANAGER";
  const isHR = user.role === "HR";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-700">Hybrid Workforce Planner</p>
          <h1 className="text-3xl font-semibold text-slate-900">Team Overview</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">
            A single view of team attendance, desk availability, and office capacity for proactive planning.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <div className="font-medium text-slate-900">{dashboardData.site}</div>
          <div>{dashboardData.floor}</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <OccupancySummary
          occupied={dashboardData.occupiedDesks}
          total={dashboardData.totalDesks}
          roomsInUse={dashboardData.occupiedRooms}
          roomsTotal={dashboardData.totalRooms}
        />
        <QuickActions />
      </div>

      {isHR && dashboardData?.hrAttendanceSummary && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Company Attendance Summary</h2>
            <p className="text-sm text-slate-500">Overall company attendance statistics.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dashboardData.hrAttendanceSummary.officeCount}
              </div>
              <div className="text-sm text-slate-600">In Office</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dashboardData.hrAttendanceSummary.wfhCount}
              </div>
              <div className="text-sm text-slate-600">Work from Home</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {dashboardData.hrAttendanceSummary.oooCount}
              </div>
              <div className="text-sm text-slate-600">Out of Office</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">
                {dashboardData.hrAttendanceSummary.totalEmployees}
              </div>
              <div className="text-sm text-slate-600">Total Employees</div>
            </div>
          </div>
        </section>
      )}

      {isManager && dashboardData.teamAttendanceCharts && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Team Attendance Overview</h2>
            <p className="text-sm text-slate-500">Weekly breakdown of team working arrangements.</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg width="200" height="200" viewBox="0 0 200 200">
                {(() => {
                  const officeTotal = dashboardData.teamAttendanceCharts!.officeAttendance[0] || 0;
                  const wfhTotal = dashboardData.teamAttendanceCharts!.wfh[0] || 0;
                  const oooTotal = dashboardData.teamAttendanceCharts!.ooo[0] || 0;
                  const total = officeTotal + wfhTotal + oooTotal;

                  if (total === 0) return null;

                  const officeAngle = (officeTotal / total) * 360;
                  const wfhAngle = (wfhTotal / total) * 360;
                  const oooAngle = (oooTotal / total) * 360;

                  const createSlice = (startAngle: number, endAngle: number, color: string, label: string, count: number) => {
                    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
                    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

                    const x1 = 100 + 80 * Math.cos(startAngleRad);
                    const y1 = 100 + 80 * Math.sin(startAngleRad);
                    const x2 = 100 + 80 * Math.cos(endAngleRad);
                    const y2 = 100 + 80 * Math.sin(endAngleRad);

                    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

                    const pathData = [
                      `M 100 100`,
                      `L ${x1} ${y1}`,
                      `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      `Z`
                    ].join(' ');

                    return (
                      <path
                        key={label}
                        d={pathData}
                        fill={color}
                        stroke="white"
                        strokeWidth="2"
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                        title={`${label}: ${count} people`}
                      />
                    );
                  };

                  let currentAngle = 0;
                  const slices = [];

                  if (officeTotal > 0) {
                    slices.push(createSlice(currentAngle, currentAngle + officeAngle, "#10b981", "Office", officeTotal));
                    currentAngle += officeAngle;
                  }
                  if (wfhTotal > 0) {
                    slices.push(createSlice(currentAngle, currentAngle + wfhAngle, "#3b82f6", "Work from Home", wfhTotal));
                    currentAngle += wfhAngle;
                  }
                  if (oooTotal > 0) {
                    slices.push(createSlice(currentAngle, currentAngle + oooAngle, "#ef4444", "Out of Office", oooTotal));
                  }

                  return slices;
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {(dashboardData.teamAttendanceCharts!.officeAttendance[0] || 0) +
                     (dashboardData.teamAttendanceCharts!.wfh[0] || 0) +
                     (dashboardData.teamAttendanceCharts!.ooo[0] || 0)}
                  </div>
                  <div className="text-sm text-slate-500">Total</div>
                </div>
              </div>
            </div>
            <div className="ml-8 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">
                  Office: {dashboardData.teamAttendanceCharts!.officeAttendance[0] || 0} people
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">
                  Work from Home: {dashboardData.teamAttendanceCharts!.wfh[0] || 0} people
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">
                  Out of Office: {dashboardData.teamAttendanceCharts!.ooo[0] || 0} people
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {isManager && dashboardData.directReportsGantt && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Direct Reports Schedule</h2>
            <p className="text-sm text-slate-500">Gantt chart view of your team's weekly schedules.</p>
          </div>
          <div className="space-y-2">
            {dashboardData.directReportsGantt.reports.map((report) => (
              <div key={report.employeeId} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium">{report.name}</div>
                <div className="flex space-x-1">
                  {report.schedule.map((status, idx) => (
                    <div
                      key={idx}
                      className={`h-6 w-6 rounded ${
                        status === "IN_OFFICE"
                          ? "bg-green-500"
                          : status === "REMOTE"
                          ? "bg-blue-500"
                          : status === "OOO"
                          ? "bg-red-500"
                          : "bg-gray-300"
                      }`}
                      title={`${report.name} - Day ${idx + 1}: ${status}`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Weekly Team Schedule</h2>
            <p className="text-sm text-slate-500">Direct teammates by default, with color-coded working locations.</p>
          </div>
          <div className="text-sm text-slate-500">Week of 2026-05-04</div>
        </div>
        <WeeklyScheduleGrid rows={dashboardData.teamSchedule} />
      </section>
    </div>
  );
}

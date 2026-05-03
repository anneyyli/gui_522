import OccupancySummary from "./components/OccupancySummary";
import QuickActions from "./components/QuickActions";
import WeeklyScheduleGrid from "./components/WeeklyScheduleGrid";

const teamRows = [
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
  {
    name: "Dan Brown",
    role: "Product",
    days: ["PENDING", "REMOTE", "IN_OFFICE", "IN_OFFICE", "REMOTE"],
  },
  {
    name: "Eve Davis",
    role: "QA",
    days: ["REMOTE", "IN_OFFICE", "PENDING", "IN_OFFICE", "OUT_OF_OFFICE"],
  },
];

export default function HomePage() {
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
          <div className="font-medium text-slate-900">Birmingham</div>
          <div>Floor 4 - Engineering</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <OccupancySummary occupied={42} total={50} roomsInUse={4} roomsTotal={6} />
        <QuickActions />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Weekly Team Schedule</h2>
            <p className="text-sm text-slate-500">Direct teammates by default, with color-coded working locations.</p>
          </div>
          <div className="text-sm text-slate-500">Week of 2026-05-04</div>
        </div>
        <WeeklyScheduleGrid rows={teamRows} />
      </section>
    </div>
  );
}

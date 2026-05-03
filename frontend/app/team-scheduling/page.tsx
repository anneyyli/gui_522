import WeeklyScheduleGrid from "../components/WeeklyScheduleGrid";

const rows = [
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

export default function TeamSchedulingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-700">Team Scheduling</p>
          <h1 className="text-3xl font-semibold text-slate-900">Weekly Schedule View</h1>
          <p className="mt-1 text-sm text-slate-600">
            Gantt-style weekly visibility of in-office, remote, out-of-office, and pending days.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          Default view: Direct teammates
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Week of 2026-05-04</h2>
            <p className="text-sm text-slate-500">Users may create up to five custom views in a later iteration.</p>
          </div>
        </div>
        <WeeklyScheduleGrid rows={rows} />
      </section>
    </div>
  );
}

import Link from "next/link";

export default function QuickActions() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
      <p className="mt-1 text-sm text-slate-500">
        Take action from the same screen where you review attendance and occupancy.
      </p>

      <div className="mt-5 grid gap-3">
        <button className="rounded-xl bg-slate-900 px-4 py-3 text-left text-sm font-medium text-white">
          Plan Team Day
        </button>
        <Link
          href="/desk-booking"
          className="rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white"
        >
          Book Desks for Team
        </Link>
        <Link
          href="/team-scheduling"
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"
        >
          Update Status
        </Link>
      </div>
    </section>
  );
}

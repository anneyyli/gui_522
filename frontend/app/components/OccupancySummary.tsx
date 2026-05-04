type Props = {
  occupied: number;
  total: number;
  roomsInUse: number;
  roomsTotal: number;
};

export default function OccupancySummary({ occupied, total, roomsInUse, roomsTotal }: Props) {
  const percent = Math.round((occupied / total) * 100);
  const available = total - occupied;

  const gradient = percent >= 90
    ? "from-rose-600 to-rose-700"
    : percent >= 70
    ? "from-amber-600 to-amber-700"
    : "from-teal-600 to-teal-700";

  return (
    <section className={`rounded-2xl border border-slate-200 bg-gradient-to-br ${gradient} p-6 shadow-sm transition-colors`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-teal-100">Today&apos;s Occupancy</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">{percent}%</span>
            <span className="text-sm text-teal-200">capacity</span>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        </div>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20">
        <div
          className={`h-full rounded-full transition-all ${percent >= 90 ? "bg-rose-400" : percent >= 70 ? "bg-amber-400" : "bg-white"}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-sm">
          <p className="text-[11px] font-medium uppercase tracking-wider text-teal-200">Occupied</p>
          <p className="mt-0.5 text-xl font-bold text-white">{occupied}</p>
        </div>
        <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-sm">
          <p className="text-[11px] font-medium uppercase tracking-wider text-teal-200">Available</p>
          <p className="mt-0.5 text-xl font-bold text-white">{available}</p>
        </div>
        <div className="rounded-xl bg-white/10 px-3 py-3 backdrop-blur-sm">
          <p className="text-[11px] font-medium uppercase tracking-wider text-teal-200">Rooms</p>
          <p className="mt-0.5 text-xl font-bold text-white">{roomsInUse}/{roomsTotal}</p>
        </div>
      </div>
    </section>
  );
}

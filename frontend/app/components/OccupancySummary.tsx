type Props = {
  occupied: number;
  total: number;
  roomsInUse: number;
  roomsTotal: number;
};

export default function OccupancySummary({ occupied, total, roomsInUse, roomsTotal }: Props) {
  const percent = Math.round((occupied / total) * 100);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3">
        <p className="text-sm font-medium text-slate-500">Today's occupancy</p>
        <h2 className="text-2xl font-semibold text-slate-900">{percent}% capacity</h2>
      </div>

      <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${percent >= 80 ? "bg-amber-500" : "bg-teal-600"}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Desks occupied</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{occupied} / {total}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Rooms in use</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{roomsInUse} / {roomsTotal}</p>
        </div>
      </div>
    </section>
  );
}

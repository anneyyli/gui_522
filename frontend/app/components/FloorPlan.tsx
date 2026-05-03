type Desk = {
  id: string;
  x: number;
  y: number;
  status: string;
  initials: string;
  label: string;
};

const deskStyles: Record<string, string> = {
  AVAILABLE: "border-slate-300 bg-white text-slate-700 hover:border-teal-500 hover:shadow",
  BOOKED: "border-slate-200 bg-slate-200 text-slate-500",
  UNAVAILABLE: "border-rose-200 bg-rose-100 text-rose-700",
  TEAM_BOOKED: "border-blue-200 bg-blue-100 text-blue-700",
};

export default function FloorPlan({
  desks,
  selectedDesk,
  onSelectDesk,
}: {
  desks: Desk[];
  selectedDesk: string;
  onSelectDesk: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-slate-900">Visual floor plan</h2>
      <p className="mb-5 text-sm text-slate-500">Desk numbers and map positions help users navigate unfamiliar seating areas.</p>

      <div className="grid max-w-2xl grid-cols-3 gap-4 rounded-2xl bg-slate-50 p-6">
        {desks.map((desk) => {
          const isSelected = desk.id === selectedDesk;
          const selectable = desk.status === "AVAILABLE";

          return (
            <button
              key={desk.id}
              onClick={() => selectable && onSelectDesk(desk.id)}
              className={`rounded-xl border p-4 text-left transition ${deskStyles[desk.status]} ${isSelected ? "ring-2 ring-blue-500" : ""}`}
              disabled={!selectable}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{desk.label}</span>
                <span className="text-xs font-semibold">
                  {desk.status === "AVAILABLE" && "+"}
                  {desk.status === "BOOKED" && "•"}
                  {desk.status === "UNAVAILABLE" && "×"}
                  {desk.status === "TEAM_BOOKED" && desk.initials}
                </span>
              </div>
              <div className="text-xs">
                {desk.status === "AVAILABLE" && "Available"}
                {desk.status === "BOOKED" && "Booked"}
                {desk.status === "UNAVAILABLE" && "Unavailable"}
                {desk.status === "TEAM_BOOKED" && "Team booked"}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

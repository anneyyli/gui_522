import type { DeskAvailability } from "@/features/desk-booking/types";

const deskStyles: Record<string, string> = {
  AVAILABLE: "border-slate-300 bg-white text-slate-700 hover:border-teal-500 hover:shadow cursor-pointer",
  BOOKED: "border-slate-200 bg-slate-200 text-slate-500 cursor-not-allowed",
  TEAM_BOOKED: "border-blue-200 bg-blue-50 text-blue-700 cursor-not-allowed",
  UNAVAILABLE: "border-rose-200 bg-rose-100 text-rose-700 cursor-not-allowed",
};

export default function FloorPlan({
  desks,
  selectedDeskId,
  onSelectDesk,
}: {
  desks: DeskAvailability[];
  selectedDeskId: string | null;
  onSelectDesk: (deskId: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-lg font-semibold text-slate-900">Visual floor plan</h2>
      <p className="mb-5 text-sm text-slate-500">Select an available desk to view details and confirm your booking.</p>

      <div className="grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-5 sm:grid-cols-4 lg:grid-cols-5">
        {desks.map((desk) => {
          const status = desk.available ? "AVAILABLE" : desk.bookedByInitials ? "TEAM_BOOKED" : "BOOKED";
          const isSelected = desk.deskId === selectedDeskId;

          return (
            <button
              key={desk.deskId}
              type="button"
              onClick={() => desk.available && onSelectDesk(desk.deskId)}
              disabled={!desk.available}
              className={`rounded-xl border p-3 text-left transition ${deskStyles[status]} ${isSelected ? "ring-2 ring-teal-500 border-teal-500" : ""}`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold">{desk.deskLabel}</span>
                <span className="text-xs font-bold">
                  {desk.available ? "+" : (desk.bookedByInitials || "•")}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">{desk.zone}</div>
              {(desk.hasMonitor || desk.hasStandingOption) && (
                <div className="mt-1 flex gap-1">
                  {desk.hasMonitor && <span className="h-1.5 w-1.5 rounded-full bg-blue-400" title="Monitor" />}
                  {desk.hasStandingOption && <span className="h-1.5 w-1.5 rounded-full bg-purple-400" title="Standing" />}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

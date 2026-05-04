import { useMemo } from "react";
import type { DeskAvailability } from "@/features/desk-booking/types";

const FLOORS = ["1", "2", "3"];
const FLOOR_LABELS: Record<string, string> = {
  "1": "Ground Floor",
  "2": "Floor 2",
  "3": "Floor 3",
};

export default function FloorPlan({
  desks,
  selectedDeskId,
  onSelectDesk,
  selectedFloor,
  onSelectFloor,
}: {
  desks: DeskAvailability[];
  selectedDeskId: string | null;
  onSelectDesk: (deskId: string) => void;
  selectedFloor: string;
  onSelectFloor: (floor: string) => void;
}) {
  const floorDesks = useMemo(
    () => desks.filter((d) => d.floor === selectedFloor),
    [desks, selectedFloor]
  );

  const zones = useMemo(() => {
    const grouped: Record<string, DeskAvailability[]> = {};
    floorDesks.forEach((desk) => {
      if (!grouped[desk.zone]) grouped[desk.zone] = [];
      grouped[desk.zone].push(desk);
    });
    return grouped;
  }, [floorDesks]);

  const floorCounts = useMemo(() => {
    const counts: Record<string, { total: number; available: number }> = {};
    FLOORS.forEach((f) => {
      const fd = desks.filter((d) => d.floor === f);
      counts[f] = { total: fd.length, available: fd.filter((d) => d.available).length };
    });
    return counts;
  }, [desks]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Floor selector */}
      <div className="mb-4 flex items-center gap-2">
        {FLOORS.map((floor) => {
          const counts = floorCounts[floor];
          const active = selectedFloor === floor;
          return (
            <button
              key={floor}
              type="button"
              onClick={() => onSelectFloor(floor)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                active
                  ? "border-teal-500 bg-teal-50 text-teal-700 font-medium"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span>{FLOOR_LABELS[floor]}</span>
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                active ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"
              }`}>
                {counts?.available ?? 0}/{counts?.total ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Office layout */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-3 flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>← Windows</span>
          <span className="font-medium text-slate-500">{FLOOR_LABELS[selectedFloor]}</span>
          <span>Corridor →</span>
        </div>

        <div className="space-y-3">
          {Object.entries(zones).map(([zoneName, zoneDesks]) => (
            <div key={zoneName}>
              <div className="mb-1.5 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{zoneName}</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-10">
                {zoneDesks.map((desk) => {
                  const isSelected = desk.deskId === selectedDeskId;
                  const isAvailable = desk.available;
                  const hasTeam = !isAvailable && desk.bookedByInitials;

                  return (
                    <button
                      key={desk.deskId}
                      type="button"
                      onClick={() => isAvailable && onSelectDesk(desk.deskId)}
                      disabled={!isAvailable}
                      aria-label={`${desk.deskLabel}, ${desk.zone}${isAvailable ? ", available — click to select" : `, booked by ${desk.bookedByInitials || "someone"}`}`}
                      title={`${desk.deskLabel} — ${desk.zone}${desk.hasMonitor ? " · Monitor" : ""}${desk.hasStandingOption ? " · Standing" : ""}`}
                      className={`relative flex flex-col items-center justify-center rounded-md border p-1.5 text-center transition h-10 ${
                        isSelected
                          ? "border-teal-500 bg-teal-50 ring-2 ring-teal-500"
                          : isAvailable
                          ? "border-slate-300 bg-white hover:border-teal-400 hover:bg-teal-50 cursor-pointer"
                          : hasTeam
                          ? "border-blue-200 bg-blue-50 cursor-not-allowed"
                          : "border-orange-200 bg-orange-50 cursor-not-allowed"
                      }`}
                    >
                      <span className="text-[10px] font-semibold leading-none text-slate-700">{desk.deskLabel}</span>
                      <span className={`text-[9px] leading-none mt-0.5 font-bold ${
                        isAvailable ? "text-teal-600" : hasTeam ? "text-blue-600" : "text-slate-400"
                      }`}>
                        {isAvailable ? "+" : (desk.bookedByInitials && desk.bookedByInitials !== "??" ? desk.bookedByInitials : "•")}
                      </span>
                      {(desk.hasMonitor || desk.hasStandingOption) && (
                        <div className="absolute top-0.5 right-0.5 flex gap-px">
                          {desk.hasMonitor && <span className="h-1 w-1 rounded-full bg-blue-400" />}
                          {desk.hasStandingOption && <span className="h-1 w-1 rounded-full bg-purple-400" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-4 border-t border-dashed border-slate-200 pt-2.5">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> Monitor
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" /> Standing
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span className="h-2 w-2 rounded-sm bg-white border border-slate-300" /> Available
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span className="h-2 w-2 rounded-sm bg-blue-50 border border-blue-200" /> Your Team
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <span className="h-2 w-2 rounded-sm bg-orange-50 border border-orange-200" /> Occupied
          </div>
        </div>
      </div>
    </section>
  );
}

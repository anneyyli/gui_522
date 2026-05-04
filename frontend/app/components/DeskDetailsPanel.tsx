import type { DeskAvailability } from "@/features/desk-booking/types";

interface Props {
  desk: DeskAvailability;
  isBooking: boolean;
  onConfirm: () => void;
  onDeselect: () => void;
}

export default function DeskDetailsPanel({ desk, isBooking, onConfirm, onDeselect }: Props) {
  const amenities: string[] = [];
  if (desk.hasMonitor) amenities.push("Monitor");
  if (desk.hasStandingOption) amenities.push("Standing desk");

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Booking details</h2>
        <button
          type="button"
          onClick={onDeselect}
          className="text-slate-400 hover:text-slate-600 text-lg leading-none"
          aria-label="Deselect desk"
        >
          ×
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Selected desk</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">{desk.deskLabel}</p>
        <p className="mt-1 text-sm text-slate-600">Floor {desk.floor} · {desk.zone}</p>
      </div>

      {amenities.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-slate-900">Amenities</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {amenities.map((item) => (
              <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onConfirm}
        disabled={isBooking}
        className="mt-6 w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
      >
        {isBooking ? "Booking…" : "Confirm Booking"}
      </button>
      <p className="mt-2 text-center text-xs text-slate-500">Bookings can be cancelled up to one hour beforehand.</p>
    </aside>
  );
}
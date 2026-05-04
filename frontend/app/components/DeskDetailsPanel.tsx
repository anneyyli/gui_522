import type { DeskAvailability } from "@/features/desk-booking/types";

interface Props {
  desk: DeskAvailability;
  isBooking: boolean;
  onConfirm: () => void;
  onDeselect: () => void;
  occupancyPercent?: number;
}

export default function DeskDetailsPanel({ desk, isBooking, onConfirm, onDeselect, occupancyPercent }: Props) {
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

      {occupancyPercent !== undefined && occupancyPercent >= 80 && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="text-xs text-amber-800">
            This floor is at <strong>{occupancyPercent}%</strong> capacity. Few desks remain — consider booking on a different floor if flexibility allows.
          </p>
        </div>
      )}

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={onDeselect}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isBooking}
          className="flex-1 rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
        >
          {isBooking ? "Booking…" : "Confirm"}
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">Bookings can be cancelled up to one hour beforehand.</p>
    </aside>
  );
}
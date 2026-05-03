const teamStatus = [
  { name: "Alice Johnson", status: "Booked" },
  { name: "Bob Smith", status: "Booked" },
  { name: "Carol White", status: "Booked" },
  { name: "Dan Brown", status: "Remote" },
  { name: "Eve Davis", status: "Booked" },
  { name: "You", status: "Selected" },
];

export default function DeskDetailsPanel({ deskId }: { deskId: string }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Booking details</h2>
      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">Selected desk</p>
        <p className="mt-1 text-xl font-semibold text-slate-900">{deskId}</p>
        <p className="mt-2 text-sm text-slate-600">Window seat, Monitor arm</p>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-900">Nearby amenities</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {["Coffee", "Printer", "5G WiFi"].map((item) => (
            <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Team status</h3>
          <span className="text-xs text-slate-500">5 of 6 booked</span>
        </div>
        <div className="space-y-2">
          {teamStatus.map((person) => (
            <div key={person.name} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-sm text-slate-800">{person.name}</span>
              <span className={`text-xs font-medium ${
                person.status === "Remote"
                  ? "text-amber-700"
                  : person.status === "Selected"
                  ? "text-blue-700"
                  : "text-emerald-700"
              }`}>
                {person.status === "Remote" ? "Invite" : person.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button className="mt-6 w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white">
        Confirm Booking
      </button>
      <p className="mt-2 text-xs text-slate-500">Bookings can be cancelled up to one hour beforehand.</p>
    </aside>
  );
}
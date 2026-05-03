const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const statusStyles: Record<string, string> = {
  IN_OFFICE: "bg-emerald-100 text-emerald-700",
  REMOTE: "bg-blue-100 text-blue-700",
  OUT_OF_OFFICE: "bg-rose-100 text-rose-700",
  PENDING: "bg-amber-100 text-amber-700",
};

const statusLabels: Record<string, string> = {
  IN_OFFICE: "In Office",
  REMOTE: "Remote",
  OUT_OF_OFFICE: "Out",
  PENDING: "Pending",
};

type Row = {
  name: string;
  role: string;
  days: string[];
};

export default function WeeklyScheduleGrid({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Team member
            </th>
            {days.map((day) => (
              <th key={day} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td className="rounded-l-xl bg-slate-50 px-3 py-3">
                <div className="font-medium text-slate-900">{row.name}</div>
                <div className="text-xs text-slate-500">{row.role}</div>
              </td>
              {row.days.map((status, idx) => (
                <td key={idx} className="bg-slate-50 px-3 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
                    {statusLabels[status]}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
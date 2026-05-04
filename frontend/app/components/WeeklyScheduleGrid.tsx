const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const statusConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
  IN_OFFICE: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Office", icon: "●" },
  REMOTE: { bg: "bg-blue-100", text: "text-blue-700", label: "Remote", icon: "◆" },
  OUT_OF_OFFICE: { bg: "bg-rose-100", text: "text-rose-700", label: "Out", icon: "○" },
  PENDING: { bg: "bg-amber-100", text: "text-amber-700", label: "Not Set", icon: "?" },
};

type Row = {
  employeeId?: string;
  name: string;
  role: string;
  days: string[];
};

export default function WeeklyScheduleGrid({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Team member
            </th>
            {days.map((day) => (
              <th key={day} className="pb-3 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((row) => (
            <tr key={row.employeeId || row.name} className="group">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600">
                    {row.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900">{row.name}</div>
                    <div className="text-[11px] text-slate-400">{row.role}</div>
                  </div>
                </div>
              </td>
              {row.days.map((status, i) => {
                const config = statusConfig[status] || { bg: "bg-slate-100", text: "text-slate-500", label: "—", icon: "—" };
                return (
                  <td key={i} className="py-3 text-center">
                    <span className={`inline-flex min-w-[3.5rem] items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-semibold ${config.bg} ${config.text}`}>
                      <span aria-hidden="true">{config.icon}</span>
                      {config.label}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StatusLegend() {
  const items = [
    { label: "Available", cls: "bg-white border-slate-300 text-slate-700", symbol: "+" },
    { label: "Booked", cls: "bg-slate-200 border-slate-300 text-slate-600", symbol: "•" },
    { label: "Unavailable", cls: "bg-rose-100 border-rose-200 text-rose-700", symbol: "×" },
    { label: "Team booked", cls: "bg-blue-100 border-blue-200 text-blue-700", symbol: "AJ" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md border text-xs font-semibold ${item.cls}`}>
            {item.symbol}
          </span>
          {item.label}
        </div>
      ))}
    </div>
  );
}

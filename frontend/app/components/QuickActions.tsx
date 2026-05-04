import Link from "next/link";

interface Action {
  href: string;
  label: string;
  description: string;
  tooltip: string;
  roles: string[];
  icon: React.ReactNode;
}

const actions: Action[] = [
  {
    href: "/plan-team-day",
    label: "Plan Team Day",
    description: "Find the best in-person day",
    tooltip: "See which day most of your team is already in the office and schedule everyone together",
    roles: ["MANAGER"],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    href: "/desk-booking",
    label: "Book Space",
    description: "Desks and meeting rooms",
    tooltip: "Browse the floor plan and reserve a desk or meeting room for a specific date",
    roles: ["MANAGER", "TEAM_MEMBER", "HR"],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
  {
    href: "/update-status",
    label: "Update Status",
    description: "Set your location",
    tooltip: "Declare whether you are working from office, remote, or out of office for each day this week",
    roles: ["MANAGER", "TEAM_MEMBER", "HR"],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    href: "/team-scheduling",
    label: "Team Schedule",
    description: "View colleague availability",
    tooltip: "See your team's weekly schedule and save custom views of colleagues you coordinate with",
    roles: ["TEAM_MEMBER"],
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
];

export default function QuickActions({ userRole }: { userRole: string }) {
  const visibleActions = actions.filter((a) => a.roles.includes(userRole));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
      <p className="mt-0.5 text-sm text-slate-500">Jump into common tasks</p>

      <div className="mt-4 space-y-2.5">
        {visibleActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            title={action.tooltip}
            className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <span className="flex-shrink-0 text-slate-400">
              {action.icon}
            </span>
            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-900">
                {action.label}
              </div>
              <div className="text-xs text-slate-500">
                {action.description}
              </div>
            </div>
            <svg className="ml-auto h-4 w-4 flex-shrink-0 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}

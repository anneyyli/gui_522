"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import WeeklyScheduleGrid from "../components/WeeklyScheduleGrid";
import { customViewsStorage, type CustomView } from "@/lib/customViewsStorage";
import { getCurrentUser, type CurrentUser } from "@/lib/auth";

const EMPLOYEES = [
  { id: "E001", name: "Alice Johnson", role: "Manager", days: ["IN_OFFICE", "REMOTE", "IN_OFFICE", "IN_OFFICE", "OUT_OF_OFFICE"] },
  { id: "E002", name: "Bob Smith", role: "Engineer", days: ["REMOTE", "REMOTE", "IN_OFFICE", "PENDING", "IN_OFFICE"] },
  { id: "E003", name: "Carol White", role: "Engineer", days: ["IN_OFFICE", "IN_OFFICE", "IN_OFFICE", "REMOTE", "REMOTE"] },
  { id: "E004", name: "Dan Brown", role: "Product", days: ["PENDING", "REMOTE", "IN_OFFICE", "IN_OFFICE", "REMOTE"] },
  { id: "E005", name: "Eve Davis", role: "QA", days: ["REMOTE", "IN_OFFICE", "PENDING", "IN_OFFICE", "OUT_OF_OFFICE"] },
];

const DEFAULT_VIEW = { id: "all", name: "All teammates", employeeIds: EMPLOYEES.map((emp) => emp.id) };

export default function TeamSchedulingPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [views, setViews] = useState<CustomView[]>([]);
  const [activeViewId, setActiveViewId] = useState(DEFAULT_VIEW.id);
  const [newViewName, setNewViewName] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(EMPLOYEES.map((emp) => emp.id));
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    const stored = customViewsStorage.load();
    setViews(stored);
    if (stored.length) {
      setActiveViewId(stored[0].id);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    customViewsStorage.save(views);
  }, [views, isHydrated]);

  const activeView = useMemo(() => {
    if (activeViewId === DEFAULT_VIEW.id) return DEFAULT_VIEW;
    return views.find((view) => view.id === activeViewId) ?? DEFAULT_VIEW;
  }, [activeViewId, views]);

  const displayRows = useMemo(
    () => EMPLOYEES.filter((employee) => activeView.employeeIds.includes(employee.id)),
    [activeView],
  );

  const canSaveView = Boolean(user) && newViewName.trim().length > 0 && selectedEmployeeIds.length > 0 && views.length < 5;

  const toggleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployeeIds((current) =>
      current.includes(employeeId) ? current.filter((id) => id !== employeeId) : [...current, employeeId],
    );
  };

  const handleSaveView = () => {
    if (!user) {
      router.push("/login?next=/team-scheduling");
      return;
    }

    if (!canSaveView) return;

    const view: CustomView = {
      id: `view-${Date.now()}`,
      name: newViewName.trim(),
      employeeIds: selectedEmployeeIds,
    };
    setViews((current) => [...current, view]);
    setActiveViewId(view.id);
    setNewViewName("");
  };

  const handleDeleteView = (viewId: string) => {
    setViews((current) => current.filter((view) => view.id !== viewId));
    if (activeViewId === viewId) {
      setActiveViewId(DEFAULT_VIEW.id);
    }
  };

  return (
    <div className="space-y-6">
      {!user && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm">
          You need to log in to save custom views to your account.
          <button
            type="button"
            onClick={() => router.push("/login?next=/team-scheduling")}
            className="ml-3 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900 hover:bg-amber-200"
          >
            Sign in
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-teal-700">Team Scheduling</p>
          <h1 className="text-3xl font-semibold text-slate-900">Weekly Schedule View</h1>
          <p className="mt-1 text-sm text-slate-600">
            Save up to five custom colleague views and choose who you track across WFH, OOO, and in-office status.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          {activeView.name}
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">Custom views</span>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
              {views.length}/5 saved
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveViewId(DEFAULT_VIEW.id)}
              className={`rounded-full border px-3 py-1 text-sm transition ${activeViewId === DEFAULT_VIEW.id ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-700"}`}
            >
              {DEFAULT_VIEW.name}
            </button>
            {views.map((view) => (
              <div key={view.id} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveViewId(view.id)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${activeViewId === view.id ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-700"}`}
                >
                  {view.name}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteView(view.id)}
                  className="text-xs text-rose-500 hover:text-rose-700"
                  aria-label={`Delete view ${view.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-900">Create custom view</h2>
              <p className="text-sm text-slate-500">Pick colleagues to include and save a view for quick selection.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-600">View name</label>
                <input
                  type="text"
                  value={newViewName}
                  onChange={(event) => setNewViewName(event.target.value)}
                  placeholder="e.g. Leadership, Project X"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-600">Choose colleagues</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {EMPLOYEES.map((employee) => (
                    <label key={employee.id} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition hover:border-teal-300">
                      <input
                        type="checkbox"
                        checked={selectedEmployeeIds.includes(employee.id)}
                        onChange={() => toggleEmployeeSelection(employee.id)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span>{employee.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveView}
                disabled={!canSaveView}
                className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save view
              </button>
              {views.length >= 5 && (
                <p className="text-xs text-slate-500">You can save up to five custom colleague views.</p>
              )}
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Week of 2026-05-04</h2>
            <p className="text-sm text-slate-500">Showing {displayRows.length} teammates in {activeView.name.toLowerCase()}.</p>
          </div>
          <WeeklyScheduleGrid rows={displayRows} />
        </section>
      </section>
    </div>
  );
}

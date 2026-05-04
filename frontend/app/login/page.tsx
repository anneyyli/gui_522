"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clearCurrentUser, getCurrentUser, getCurrentUserSession, login } from "@/lib/auth";

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-center py-20 text-sm text-slate-500">Loading…</p>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const nextUrl = searchParams.get("next") ?? "/";

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    getCurrentUserSession().then((verified) => {
      if (verified) {
        router.replace(nextUrl);
      } else {
        clearCurrentUser();
      }
    });
  }, [nextUrl, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      await login(employeeId.trim(), password);
      router.push(nextUrl);
    } catch (err: any) {
      setError(err?.message ?? "Unable to log in. Please try again.");
    }
  };

  const demoAccounts = [
    { id: "E001", label: "Alice Johnson", role: "Manager", description: "Team attendance, direct reports Gantt, desk occupancy", color: "border-emerald-200 bg-emerald-50 hover:border-emerald-300" },
    { id: "E002", label: "Bob Smith", role: "Team Member", description: "Personal planner, teammate availability, desk booking", color: "border-blue-200 bg-blue-50 hover:border-blue-300" },
    { id: "E006", label: "Frank Miller", role: "HR", description: "Company-wide analytics, occupancy trends, capacity alerts", color: "border-purple-200 bg-purple-50 hover:border-purple-300" },
  ];

  const handleDemoLogin = async (demoId: string) => {
    setError(null);
    try {
      await login(demoId, "password123");
      router.push(nextUrl);
    } catch (err: any) {
      setError(err?.message ?? "Unable to log in. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <p className="text-sm font-medium text-teal-700">Welcome back</p>
        <h1 className="text-3xl font-semibold text-slate-900">Sign in to HybridWork</h1>
        <p className="mt-2 text-sm text-slate-500">Use your employee ID and password to manage desk bookings and custom views.</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Quick login — choose a role</p>
        {demoAccounts.map((account) => (
          <button
            key={account.id}
            type="button"
            onClick={() => handleDemoLogin(account.id)}
            className={`w-full rounded-xl border px-4 py-3 text-left transition ${account.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-slate-900">{account.label}</span>
                <span className="ml-2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600">{account.role}</span>
              </div>
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </div>
            <p className="mt-1 text-xs text-slate-500">{account.description}</p>
          </button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-slate-400">or sign in manually</span></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <div>
          <label htmlFor="employeeId" className="block text-xs font-medium uppercase tracking-wide text-slate-600">
            Employee ID
          </label>
          <input
            id="employeeId"
            value={employeeId}
            onChange={(event) => setEmployeeId(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            placeholder="E001"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wide text-slate-600">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            placeholder="Password"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

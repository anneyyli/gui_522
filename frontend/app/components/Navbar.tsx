"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout, type CurrentUser } from "@/lib/auth";

export default function Navbar() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="h-14 border-b border-gray-200 bg-white flex items-center px-6">
      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-slate-600">{user.name}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{user.role}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-teal-600 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700 transition hover:bg-teal-100"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

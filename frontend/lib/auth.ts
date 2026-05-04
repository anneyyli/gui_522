import { api } from "@/lib/apiClient";

export type CurrentUser = {
  employeeId: string;
  name: string;
  email: string;
};

const STORAGE_KEY = "hybridwork-current-user";

export async function login(employeeId: string, password: string): Promise<CurrentUser> {
  const response = await api.post<CurrentUser>("/auth/login", { employeeId, password });
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
  }
  return response;
}

export async function logout(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await api.post<void>("/auth/logout", {});
  } catch {
    // Ignore logout errors, still clear local state.
  }
  clearCurrentUser();
}

export async function getCurrentUserSession(): Promise<CurrentUser | null> {
  try {
    return await api.get<CurrentUser>("/auth/me");
  } catch {
    clearCurrentUser();
    return null;
  }
}

export function clearCurrentUser(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as CurrentUser;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

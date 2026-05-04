import { getCurrentUser } from "@/lib/auth";

const STORAGE_KEY = "team-scheduling-custom-views";

export type CustomView = {
  id: string;
  name: string;
  employeeIds: string[];
};

function getUserStorageKey() {
  const user = getCurrentUser();
  return user ? `${STORAGE_KEY}-${user.employeeId}` : STORAGE_KEY;
}

export const customViewsStorage = {
  load: (): CustomView[] => {
    if (typeof window === "undefined") return [];
    const user = getCurrentUser();
    if (!user) return [];

    const stored = window.localStorage.getItem(getUserStorageKey());
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored) as CustomView[];
      return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
    } catch {
      return [];
    }
  },

  save: (views: CustomView[]): void => {
    if (typeof window === "undefined") return;
    const user = getCurrentUser();
    if (!user) return;

    window.localStorage.setItem(getUserStorageKey(), JSON.stringify(views.slice(0, 5)));
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    const user = getCurrentUser();
    if (!user) return;
    window.localStorage.removeItem(getUserStorageKey());
  },
};

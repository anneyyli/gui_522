const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const isBrowser = typeof window !== "undefined";

function buildUrl(path: string) {
  if (isBrowser) {
    if (path.startsWith("/api")) {
      return path;
    }

    if (path.startsWith("/")) {
      return `/api${path}`;
    }

    return `/api/${path}`;
  }

  if (BASE_URL) {
    const normalizedBaseUrl = BASE_URL.replace(/\/$/, "");
    return path.startsWith("/") ? `${normalizedBaseUrl}${path}` : `${normalizedBaseUrl}/${path}`;
  }

  if (path.startsWith("/api")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `/api${path}`;
  }

  return `/api/${path}`;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = buildUrl(path);
  const headers = {
    "Content-Type": "application/json",
    ...(options?.headers ?? {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: options?.credentials ?? "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) {
    return {} as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return {} as T;
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  delete: (path: string) => request(path, { method: "DELETE" }),
};
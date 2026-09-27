export const BACKEND_URL =
  import.meta.env.VITE_API_URL || "https://arab-brand-4qj7.vercel.app";

/**
 * Resolves an API endpoint path to the full URL or proxied path.
 * In local dev (Vite proxy) & Vercel deployment (vercel.json rewrite),
 * relative path `/api/...` keeps the connection same-origin for session cookies.
 */
export const getApiUrl = (endpoint: string): string => {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const clean = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (import.meta.env.VITE_USE_DIRECT_API === "true") {
    return `${BACKEND_URL.replace(/\/$/, "")}${clean}`;
  }

  return clean;
};

/**
 * Wrapper around window.fetch with credentials: "include" and default JSON headers
 */
export const apiFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  let url = input;
  if (typeof input === "string") {
    url = getApiUrl(input);
  }

  const defaultHeaders: Record<string, string> = {};
  if (init?.body && !(init.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  return window.fetch(url, {
    credentials: "include",
    ...init,
    headers: {
      ...defaultHeaders,
      ...(init?.headers || {}),
    },
  });
};

export { apiFetch as fetch };
export default apiFetch;
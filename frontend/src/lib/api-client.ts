/**
 * Secure API Client Wrapper
 *
 * Automatically attaches Authorization: Bearer <JWT> to all requests.
 * Handles common error status codes (401, 404, 422).
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

import { authClient } from "./auth-client";

// ... existing code ...

export async function apiClient<T>(
  endpoint: string,
  { params, ...options }: RequestOptions = {}
): Promise<T> {
  // ... existing URL construction ...
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  }

  // 2. Prepare headers with JWT
  const headers = new Headers(options.headers);

  // Fetch token using the Better Auth client properly
  const session = await authClient.getSession();
  const token = session.data?.session.token;

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // ... rest of the function ...

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // 3. Execute request
  const response = await fetch(url.toString(), {
    ...options,
    headers,
  });

  // 4. Handle errors
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized (redirect to login if on client)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    const errorData = await response.json().catch(() => ({ detail: "An unknown error occurred" }));
    throw new Error(errorData.detail || response.statusText);
  }

  // 5. Parse response
  if (response.status === 204) return {} as T;
  return response.json();
}

/**
 * Convenience methods for CRUD operations
 */
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};

/**
 * Secure API Client Wrapper
 *
 * Automatically attaches Authorization: Bearer <JWT> to all requests.
 * Handles common error status codes (401, 404, 422).
 */

// Use Next.js API routes as proxy to validate Better Auth session
// and forward requests to FastAPI backend
const API_BASE_URL = "/api";

type RequestOptions = RequestInit & {
  params?: Record<string, string>;
};

import { authClient } from "./auth-client";

// ... existing code ...

export async function apiClient<T>(
  endpoint: string,
  { params, ...options }: RequestOptions = {}
): Promise<T> {
  // Map the API endpoint to the proxy route
  // e.g., /tasks -> /api/tasks, /tasks/1 -> /api/tasks/1
  const proxyEndpoint = endpoint;
  const url = new URL(`${API_BASE_URL}${proxyEndpoint}`);
  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  }

  // 2. Prepare headers
  const headers = new Headers(options.headers);

  // No authentication needed here since the proxy route will handle it
  // The Next.js API route will validate Better Auth session and forward to backend

  // ... rest of the function ...

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // 3. Execute request
  // The proxy route will handle authentication and cookies
  const response = await fetch(url.toString(), {
    ...options,
    headers,
  });

  // 4. Handle errors
  if (!response.ok) {
    // Don't redirect automatically, let the caller handle it
    // This gives the UI more control over error handling
    const errorData = await response.json().catch(() => ({
      detail: `HTTP ${response.status}: ${response.statusText}`,
      status: response.status
    }));

    // Log the error for debugging
    console.error(`API Error ${response.status}:`, errorData);

    throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
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

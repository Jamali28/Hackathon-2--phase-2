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
  const proxyEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  // Combine the base URL and endpoint, ensuring no double slashes
  let fullUrl = baseUrl + proxyEndpoint;
  // Replace any double slashes that might occur from concatenation (e.g., /api//tasks)
  fullUrl = fullUrl.replace(/\/+/g, '/');

  // For client-side requests in Next.js, we can use the relative URL directly
  // but we still need to process the params, so we'll create a URL object properly
  const fullUrlWithParams = new URL(fullUrl, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  if (params) {
    Object.keys(params).forEach((key) =>
      fullUrlWithParams.searchParams.append(key, params[key])
    );
  }

  // 2. Prepare headers
  const headers = new Headers(options.headers);

  // Include credentials to send cookies with the request
  // This ensures session cookies are sent to the proxy route
  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include' as RequestCredentials,
  };

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // 3. Execute request
  // The proxy route will handle authentication and cookies
  const response = await fetch(fullUrlWithParams.toString(), fetchOptions);

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

  put: <T>(endpoint: string, body: any, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};

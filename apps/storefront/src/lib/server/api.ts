const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000';

/**
 * Server-side fetch wrapper that proxies requests to the backend API.
 * Automatically injects the Host header for multi-tenant store resolution.
 * Uses `redirect: 'manual'` so Set-Cookie headers are preserved.
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {},
  host?: string,
): Promise<Response> {
  const headers = new Headers(options.headers as Record<string, string>);
  if (host) headers.set('Host', host);
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    redirect: 'manual',
  });
}
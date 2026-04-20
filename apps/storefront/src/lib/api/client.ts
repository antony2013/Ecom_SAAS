const API_BASE = '/api/v1';

interface ApiOptions extends RequestInit {
  host?: string;
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const { host, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers as Record<string, string>);
  headers.set('Content-Type', 'application/json');

  if (host) {
    headers.set('Host', host);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      error: 'Unknown Error',
      message: 'An unexpected error occurred',
    }));
    throw error;
  }

  return res.json();
}
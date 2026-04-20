import type { Handle } from '@sveltejs/kit';
import { safeDecodeJWT, isTokenExpired, getAuthScope } from '@repo/shared-utils/jwt';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:3000';

export const handle: Handle = async ({ event, resolve }) => {
  const accessToken = event.cookies.get('access_token');

  if (accessToken) {
    const payload = safeDecodeJWT(accessToken);

    if (payload && isTokenExpired(payload)) {
      // Try to refresh the token
      try {
        const refreshResponse = await fetch(`${API_BASE}/api/v1/customer/auth/refresh`, {
          method: 'POST',
          headers: {
            Cookie: `refresh_token=${event.cookies.get('refresh_token')}`,
          },
        });

        if (refreshResponse.ok) {
          // Forward new cookies
          const setCookies = refreshResponse.headers.getSetCookie();
          for (const cookie of setCookies) {
            const [nameValue] = cookie.split(';');
            const eqIdx = nameValue.indexOf('=');
            const name = nameValue.substring(0, eqIdx).trim();
            const value = nameValue.substring(eqIdx + 1).trim();
            event.cookies.set(name, value, { path: '/' });
          }
        } else {
          // Refresh failed — clear auth cookies
          event.cookies.delete('access_token', { path: '/' });
          event.cookies.delete('refresh_token', { path: '/' });
        }
      } catch {
        // Refresh request failed — continue without refreshing
      }
    }

    // Set locals for auth state
    if (payload) {
      const scope = getAuthScope(payload);
      if (scope === 'customer' && 'customerId' in payload) {
        event.locals.customerId = payload.customerId;
        event.locals.storeId = payload.storeId;
      }
    }
  }

  return resolve(event);
};
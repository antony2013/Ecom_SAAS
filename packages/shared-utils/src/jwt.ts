export interface MerchantJWTPayload {
  userId: string;
  storeId: string;
  role: string;
  jti: string;
  type: 'access' | 'refresh';
  exp?: number;
  iat?: number;
}

export interface CustomerJWTPayload {
  customerId: string;
  storeId: string;
  jti: string;
  type: 'access' | 'refresh';
  exp?: number;
  iat?: number;
}

export interface SuperAdminJWTPayload {
  superAdminId: string;
  role: 'superAdmin';
  jti: string;
  type: 'access' | 'refresh';
  exp?: number;
  iat?: number;
}

export type AnyJWTPayload = MerchantJWTPayload | CustomerJWTPayload | SuperAdminJWTPayload;

/**
 * Decode JWT payload without verification.
 * The backend already verified the token — we just need the claims.
 */
export function decodeJWTPayload(token: string): unknown {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  const payload = parts[1];
  const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(decoded);
}

/**
 * Safely decode a JWT, returning null on failure.
 */
export function safeDecodeJWT(token: string | undefined): AnyJWTPayload | null {
  if (!token) return null;
  try {
    const payload = decodeJWTPayload(token) as AnyJWTPayload;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if a decoded JWT is expired.
 */
export function isTokenExpired(payload: { exp?: number }): boolean {
  if (!payload.exp) return false;
  return Date.now() / 1000 > payload.exp;
}

/**
 * Determine the auth scope from a JWT payload.
 */
export function getAuthScope(payload: AnyJWTPayload): 'merchant' | 'customer' | 'superadmin' | null {
  if ('superAdminId' in payload) return 'superadmin';
  if ('customerId' in payload) return 'customer';
  if ('userId' in payload) return 'merchant';
  return null;
}
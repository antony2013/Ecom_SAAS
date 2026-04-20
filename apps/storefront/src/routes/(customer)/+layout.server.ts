import type { LayoutServerLoad } from './$types.js';
import { redirect } from '@sveltejs/kit';
import { safeDecodeJWT, isTokenExpired, getAuthScope } from '@repo/shared-utils';
import type { CustomerJWTPayload } from '@repo/shared-utils';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const accessToken = cookies.get('access_token');

  if (!accessToken) {
    redirect(303, '/login');
  }

  const payload = safeDecodeJWT(accessToken);

  if (!payload || isTokenExpired(payload)) {
    redirect(303, '/login');
  }

  const scope = getAuthScope(payload);

  if (scope !== 'customer') {
    redirect(303, '/login');
  }

  const customer = payload as CustomerJWTPayload;

  return {
    user: {
      customerId: customer.customerId,
      storeId: customer.storeId,
    },
  };
};
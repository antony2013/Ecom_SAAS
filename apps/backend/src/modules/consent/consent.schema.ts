import { z } from 'zod';

export const createConsentSchema = z.strictObject({
  essential: z.boolean().default(true),
  analytics: z.boolean().default(false),
  marketing: z.boolean().default(false),
});

export const updateConsentSchema = z.strictObject({
  analytics: z.boolean().optional(),
  marketing: z.boolean().optional(),
});

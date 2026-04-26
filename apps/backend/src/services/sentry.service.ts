import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { env } from '../config/env.js';

export function initSentry() {
  if (!env.SENTRY_DSN) return;
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    integrations: [nodeProfilingIntegration()],
    tracesSampleRate: env.isProduction ? 0.2 : 1.0,
    profilesSampleRate: env.isProduction ? 0.1 : 1.0,
  });
}

export { Sentry };

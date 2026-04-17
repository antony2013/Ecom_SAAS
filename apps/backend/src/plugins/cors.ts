import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import { FastifyInstance } from 'fastify';
import { env } from '../config/env.js';

export default fp(async function corsPlugin(fastify: FastifyInstance) {
  // Parse CORS_ORIGINS env var (comma-separated list of origin patterns)
  const allowedPatterns: string[] = env.CORS_ORIGINS
    ? env.CORS_ORIGINS.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  await fastify.register(cors, {
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, server-to-server, curl)
      if (!origin) {
        callback(null, true);
        return;
      }

      if (env.isDevelopment) {
        // In development: allow any localhost/127.0.0.1 origin
        try {
          const url = new URL(origin);
          if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
            callback(null, true);
            return;
          }
          // Also allow any subdomain of localhost (e.g., techgear.localhost:3000)
          if (url.hostname.endsWith('.localhost')) {
            callback(null, true);
            return;
          }
        } catch {
          callback(null, false);
          return;
        }
      }

      // Check against allowed patterns (exact match or wildcard subdomain)
      for (const pattern of allowedPatterns) {
        // Exact match
        if (origin === pattern) {
          callback(null, true);
          return;
        }
        // Wildcard subdomain match: "*.myplatform.com" matches "store1.myplatform.com"
        if (pattern.startsWith('*.')) {
          const baseDomain = pattern.slice(2); // e.g., "myplatform.com"
          try {
            const url = new URL(origin);
            if (url.hostname === baseDomain || url.hostname.endsWith('.' + baseDomain)) {
              callback(null, true);
              return;
            }
          } catch {
            continue;
          }
        }
      }

      // No match found
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400,
  });
}, { name: 'cors', dependencies: [] });
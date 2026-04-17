// Plugin registration - all plugins registered here
// Wrapped in fastify-plugin to break encapsulation boundary
// so that decorations (redis, jwt, etc.) are available at root scope

import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { env } from '../config/env.js';
import { join } from 'node:path';

export default fp(async function plugins(fastify: FastifyInstance) {
  // Core plugins (order matters)
  await fastify.register(import('./sensible.js'));
  await fastify.register(import('./helmet.js'));
  await fastify.register(import('./cors.js'));
  await fastify.register(import('./compress.js'));
  await fastify.register(import('./rateLimit.js'));
  await fastify.register(import('./jwt.js'));
  await fastify.register(import('./redis.js'));
  await fastify.register(import('./multipart.js'));

  // Serve local uploads in development (S3 serves directly in production)
  if (env.isDevelopment) {
    const { default: fastifyStatic } = await import('@fastify/static');
    await fastify.register(fastifyStatic, {
      root: join(process.cwd(), 'uploads'),
      prefix: '/uploads/',
      decorateReply: false,
    });
  }

  // Documentation (dev only)
  if (process.env.NODE_ENV !== 'production') {
    await fastify.register(import('./swagger.js'));
  }
}, { name: 'plugins', fastify: '5.x' });
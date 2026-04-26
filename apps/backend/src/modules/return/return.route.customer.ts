// Customer Returns Routes - Create and view returns
import { FastifyInstance } from 'fastify';
import { returnService } from './return.service.js';
import { createReturnSchema, idParamSchema } from './return.schema.js';
import { listQuerySchema } from './return.schema.js';
import { ErrorCodes } from '../../errors/codes.js';

export default async function customerReturnsRoutes(fastify: FastifyInstance) {
  // POST /api/v1/customer/returns - Create a return
  fastify.post('/', {
    schema: {
      tags: ['Customer Returns'],
      summary: 'Create return',
      description: 'Create a new return request for an order',
      security: [{ cookieAuth: [] }],
    },
  }, async (request, reply) => {
    const parsed = createReturnSchema.parse(request.body);
    const ret = await returnService.createReturn({
      storeId: request.storeId,
      customerId: request.customerId,
      ...parsed,
    });
    reply.status(201);
    return { data: ret };
  });

  // GET /api/v1/customer/returns - List customer returns
  fastify.get('/', {
    schema: {
      tags: ['Customer Returns'],
      summary: 'List customer returns',
      description: 'List returns belonging to the authenticated customer with pagination',
      security: [{ cookieAuth: [] }],
    },
  }, async (request) => {
    const query = listQuerySchema.parse(request.query);
    const result = await returnService.listReturns(request.storeId, { ...query, customerId: request.customerId });
    return result;
  });

  // GET /api/v1/customer/returns/:id - Get return detail
  fastify.get('/:id', {
    schema: {
      tags: ['Customer Returns'],
      summary: 'Get return detail',
      description: 'Retrieve a specific return belonging to the authenticated customer',
      security: [{ cookieAuth: [] }],
    },
  }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const ret = await returnService.getReturn(id, request.storeId);

    // Ensure the return belongs to this customer
    if (ret.customerId !== request.customerId) {
      reply.status(403).send({ error: 'Forbidden', code: ErrorCodes.RETURN_UNAUTHORIZED, message: 'Not your return' });
      return;
    }

    return { data: ret };
  });
}

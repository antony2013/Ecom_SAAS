// Merchant Returns Routes - Return listing, detail, status updates
import { FastifyInstance } from 'fastify';
import { requirePermission } from '../../scopes/merchant.js';
import { returnService } from './return.service.js';
import { merchantListQuerySchema, updateReturnStatusSchema, idParamSchema } from './return.schema.js';

export default async function merchantReturnsRoutes(fastify: FastifyInstance) {
  // GET /api/v1/merchant/returns
  fastify.get('/', {
    schema: {
      tags: ['Merchant Returns'],
      summary: 'List returns',
      description: 'List all returns for the authenticated merchant store with optional status filter and pagination',
      security: [{ cookieAuth: [] }],
    },
  }, async (request) => {
    const query = merchantListQuerySchema.parse(request.query);
    const result = await returnService.listReturns(request.storeId, query);
    return result;
  });

  // GET /api/v1/merchant/returns/:id
  fastify.get('/:id', {
    schema: {
      tags: ['Merchant Returns'],
      summary: 'Get return detail',
      description: 'Retrieve a single return by ID for the authenticated merchant store',
      security: [{ cookieAuth: [] }],
    },
  }, async (request) => {
    const { id } = idParamSchema.parse(request.params);
    const ret = await returnService.getReturn(id, request.storeId);
    return { returnRequest: ret };
  });

  // PATCH /api/v1/merchant/returns/:id/status
  fastify.patch('/:id/status', {
    preHandler: requirePermission('returns:write'),
    schema: {
      tags: ['Merchant Returns'],
      summary: 'Update return status',
      description: 'Update the status of a return (requested, approved, received, inspected, refunded, rejected, cancelled)',
      security: [{ cookieAuth: [] }],
    },
  }, async (request) => {
    const { id } = idParamSchema.parse(request.params);
    const parsed = updateReturnStatusSchema.parse(request.body);
    const ret = await returnService.updateStatus(id, request.storeId, parsed.status, parsed.adminNotes);
    return { returnRequest: ret };
  });
}

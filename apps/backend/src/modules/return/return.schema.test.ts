import { describe, it, expect } from 'vitest';
import { returns, returnItems, returnsRelations, returnItemsRelations } from '../../db/schema.js';

describe('return schema exports', () => {
  it('exports returns table', () => {
    expect(returns).toBeDefined();
    expect(returns).toHaveProperty('id');
  });

  it('exports returnItems table', () => {
    expect(returnItems).toBeDefined();
    expect(returnItems).toHaveProperty('id');
  });

  it('exports returnsRelations', () => {
    expect(returnsRelations).toBeDefined();
  });

  it('exports returnItemsRelations', () => {
    expect(returnItemsRelations).toBeDefined();
  });
});

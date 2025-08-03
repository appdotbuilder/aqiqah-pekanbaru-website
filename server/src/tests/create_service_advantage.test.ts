
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { serviceAdvantagesTable } from '../db/schema';
import { type CreateServiceAdvantageInput } from '../schema';
import { createServiceAdvantage } from '../handlers/create_service_advantage';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateServiceAdvantageInput = {
  title: 'Fast Delivery',
  description: 'We deliver your food quickly and efficiently',
  icon_name: 'delivery-truck',
  display_order: 1
};

describe('createServiceAdvantage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a service advantage', async () => {
    const result = await createServiceAdvantage(testInput);

    // Basic field validation
    expect(result.title).toEqual('Fast Delivery');
    expect(result.description).toEqual(testInput.description);
    expect(result.icon_name).toEqual('delivery-truck');
    expect(result.display_order).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.is_active).toBe(true);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save service advantage to database', async () => {
    const result = await createServiceAdvantage(testInput);

    // Query using proper drizzle syntax
    const advantages = await db.select()
      .from(serviceAdvantagesTable)
      .where(eq(serviceAdvantagesTable.id, result.id))
      .execute();

    expect(advantages).toHaveLength(1);
    expect(advantages[0].title).toEqual('Fast Delivery');
    expect(advantages[0].description).toEqual(testInput.description);
    expect(advantages[0].icon_name).toEqual('delivery-truck');
    expect(advantages[0].display_order).toEqual(1);
    expect(advantages[0].is_active).toBe(true);
    expect(advantages[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle null icon_name', async () => {
    const inputWithNullIcon: CreateServiceAdvantageInput = {
      title: 'Quality Service',
      description: 'High quality food and service',
      icon_name: null,
      display_order: 2
    };

    const result = await createServiceAdvantage(inputWithNullIcon);

    expect(result.title).toEqual('Quality Service');
    expect(result.icon_name).toBeNull();
    expect(result.display_order).toEqual(2);
    expect(result.is_active).toBe(true);
  });

  it('should handle zero display_order', async () => {
    const inputWithZeroOrder: CreateServiceAdvantageInput = {
      title: 'Affordable Prices',
      description: 'Best prices in town',
      icon_name: 'dollar-sign',
      display_order: 0
    };

    const result = await createServiceAdvantage(inputWithZeroOrder);

    expect(result.display_order).toEqual(0);
    expect(result.title).toEqual('Affordable Prices');
  });
});

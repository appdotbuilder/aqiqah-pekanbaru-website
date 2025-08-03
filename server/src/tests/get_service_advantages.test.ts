
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { serviceAdvantagesTable } from '../db/schema';
import { getServiceAdvantages } from '../handlers/get_service_advantages';

describe('getServiceAdvantages', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no service advantages exist', async () => {
    const result = await getServiceAdvantages();
    expect(result).toEqual([]);
  });

  it('should return active service advantages ordered by display_order', async () => {
    // Create test service advantages
    await db.insert(serviceAdvantagesTable).values([
      {
        title: 'Advantage 1',
        description: 'First advantage',
        icon_name: 'icon1',
        display_order: 2,
        is_active: true
      },
      {
        title: 'Advantage 2', 
        description: 'Second advantage',
        icon_name: 'icon2',
        display_order: 1,
        is_active: true
      },
      {
        title: 'Advantage 3',
        description: 'Third advantage',
        icon_name: 'icon3',
        display_order: 3,
        is_active: true
      }
    ]).execute();

    const result = await getServiceAdvantages();

    expect(result).toHaveLength(3);
    expect(result[0].title).toEqual('Advantage 2'); // display_order: 1
    expect(result[1].title).toEqual('Advantage 1'); // display_order: 2
    expect(result[2].title).toEqual('Advantage 3'); // display_order: 3
  });

  it('should only return active service advantages', async () => {
    // Create mix of active and inactive service advantages
    await db.insert(serviceAdvantagesTable).values([
      {
        title: 'Active Advantage',
        description: 'This is active',
        icon_name: 'icon1',
        display_order: 1,
        is_active: true
      },
      {
        title: 'Inactive Advantage',
        description: 'This is inactive',
        icon_name: 'icon2',
        display_order: 2,
        is_active: false
      }
    ]).execute();

    const result = await getServiceAdvantages();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Active Advantage');
    expect(result[0].is_active).toBe(true);
  });

  it('should return all required fields', async () => {
    await db.insert(serviceAdvantagesTable).values({
      title: 'Test Advantage',
      description: 'Test description',
      icon_name: 'test-icon',
      display_order: 1,
      is_active: true
    }).execute();

    const result = await getServiceAdvantages();

    expect(result).toHaveLength(1);
    const advantage = result[0];

    expect(advantage.id).toBeDefined();
    expect(advantage.title).toEqual('Test Advantage');
    expect(advantage.description).toEqual('Test description');
    expect(advantage.icon_name).toEqual('test-icon');
    expect(advantage.display_order).toEqual(1);
    expect(advantage.is_active).toBe(true);
    expect(advantage.created_at).toBeInstanceOf(Date);
  });

  it('should handle null icon_name correctly', async () => {
    await db.insert(serviceAdvantagesTable).values({
      title: 'No Icon Advantage',
      description: 'Advantage without icon',
      icon_name: null,
      display_order: 1,
      is_active: true
    }).execute();

    const result = await getServiceAdvantages();

    expect(result).toHaveLength(1);
    expect(result[0].icon_name).toBeNull();
  });
});

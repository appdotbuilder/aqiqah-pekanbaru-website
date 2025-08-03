
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { serviceOfferingsTable } from '../db/schema';
import { getServiceOfferings } from '../handlers/get_service_offerings';

describe('getServiceOfferings', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return active service offerings ordered by display_order', async () => {
    // Insert test data with different display orders
    await db.insert(serviceOfferingsTable)
      .values([
        {
          title: 'Service B',
          description: 'Second service',
          image_url: 'https://example.com/service-b.jpg',
          display_order: 2,
          is_active: true
        },
        {
          title: 'Service A',
          description: 'First service',
          image_url: 'https://example.com/service-a.jpg',
          display_order: 1,
          is_active: true
        },
        {
          title: 'Service C',
          description: 'Third service',
          image_url: 'https://example.com/service-c.jpg',
          display_order: 3,
          is_active: true
        }
      ])
      .execute();

    const result = await getServiceOfferings();

    expect(result).toHaveLength(3);
    
    // Verify ordering by display_order
    expect(result[0].title).toBe('Service A');
    expect(result[0].display_order).toBe(1);
    expect(result[1].title).toBe('Service B');
    expect(result[1].display_order).toBe(2);
    expect(result[2].title).toBe('Service C');
    expect(result[2].display_order).toBe(3);

    // Verify all fields are present
    result.forEach(offering => {
      expect(offering.id).toBeDefined();
      expect(offering.title).toBeDefined();
      expect(offering.description).toBeDefined();
      expect(offering.display_order).toBeDefined();
      expect(offering.is_active).toBe(true);
      expect(offering.created_at).toBeInstanceOf(Date);
    });
  });

  it('should only return active service offerings', async () => {
    // Insert both active and inactive service offerings
    await db.insert(serviceOfferingsTable)
      .values([
        {
          title: 'Active Service',
          description: 'This service is active',
          display_order: 1,
          is_active: true
        },
        {
          title: 'Inactive Service',
          description: 'This service is inactive',
          display_order: 2,
          is_active: false
        }
      ])
      .execute();

    const result = await getServiceOfferings();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Active Service');
    expect(result[0].is_active).toBe(true);
  });

  it('should return empty array when no active service offerings exist', async () => {
    // Insert only inactive service offerings
    await db.insert(serviceOfferingsTable)
      .values([
        {
          title: 'Inactive Service',
          description: 'This service is inactive',
          display_order: 1,
          is_active: false
        }
      ])
      .execute();

    const result = await getServiceOfferings();

    expect(result).toHaveLength(0);
  });

  it('should handle nullable fields correctly', async () => {
    // Insert service offering with null image_url
    await db.insert(serviceOfferingsTable)
      .values([
        {
          title: 'Service Without Image',
          description: 'Service with no image',
          image_url: null,
          display_order: 1,
          is_active: true
        }
      ])
      .execute();

    const result = await getServiceOfferings();

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Service Without Image');
    expect(result[0].image_url).toBeNull();
  });
});

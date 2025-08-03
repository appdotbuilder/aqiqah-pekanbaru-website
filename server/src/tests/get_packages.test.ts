
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { packagesTable } from '../db/schema';
import { type CreatePackageInput } from '../schema';
import { getPackages } from '../handlers/get_packages';

// Test package inputs
const testPackage1: CreatePackageInput = {
  name: 'Basic Package',
  description: 'Basic catering package for small events',
  price: 150.00,
  features: '["10 guests", "3 main dishes", "2 side dishes"]',
  is_popular: false,
  display_order: 2
};

const testPackage2: CreatePackageInput = {
  name: 'Premium Package',
  description: 'Premium catering package for large events',
  price: 350.50,
  features: '["50 guests", "5 main dishes", "4 side dishes", "dessert"]',
  is_popular: true,
  display_order: 1
};

const testPackage3: CreatePackageInput = {
  name: 'Inactive Package',
  description: 'This package should not appear in results',
  price: 200.00,
  features: '["20 guests", "4 main dishes"]',
  is_popular: false,
  display_order: 3
};

describe('getPackages', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no packages exist', async () => {
    const result = await getPackages();
    expect(result).toEqual([]);
  });

  it('should return all active packages ordered by display_order', async () => {
    // Create test packages
    await db.insert(packagesTable).values([
      {
        ...testPackage1,
        price: testPackage1.price.toString()
      },
      {
        ...testPackage2,
        price: testPackage2.price.toString()
      }
    ]).execute();

    const result = await getPackages();

    expect(result).toHaveLength(2);
    
    // Should be ordered by display_order (Premium first with order 1, Basic second with order 2)
    expect(result[0].name).toEqual('Premium Package');
    expect(result[0].display_order).toEqual(1);
    expect(result[0].price).toEqual(350.50);
    expect(typeof result[0].price).toBe('number');
    
    expect(result[1].name).toEqual('Basic Package');
    expect(result[1].display_order).toEqual(2);
    expect(result[1].price).toEqual(150.00);
    expect(typeof result[1].price).toBe('number');
  });

  it('should exclude inactive packages from results', async () => {
    // Create both active and inactive packages
    await db.insert(packagesTable).values([
      {
        ...testPackage1,
        price: testPackage1.price.toString()
      },
      {
        ...testPackage3,
        price: testPackage3.price.toString(),
        is_active: false
      }
    ]).execute();

    const result = await getPackages();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Basic Package');
    expect(result[0].is_active).toBe(true);
  });

  it('should return all package fields correctly', async () => {
    await db.insert(packagesTable).values({
      ...testPackage2,
      price: testPackage2.price.toString()
    }).execute();

    const result = await getPackages();

    expect(result).toHaveLength(1);
    const pkg = result[0];
    
    expect(pkg.id).toBeDefined();
    expect(pkg.name).toEqual('Premium Package');
    expect(pkg.description).toEqual('Premium catering package for large events');
    expect(pkg.price).toEqual(350.50);
    expect(pkg.features).toEqual('["50 guests", "5 main dishes", "4 side dishes", "dessert"]');
    expect(pkg.is_popular).toBe(true);
    expect(pkg.is_active).toBe(true);
    expect(pkg.display_order).toEqual(1);
    expect(pkg.created_at).toBeInstanceOf(Date);
    expect(pkg.updated_at).toBeInstanceOf(Date);
  });
});

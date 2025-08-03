
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { packagesTable } from '../db/schema';
import { type CreatePackageInput } from '../schema';
import { createPackage } from '../handlers/create_package';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreatePackageInput = {
  name: 'Premium Package',
  description: 'A comprehensive catering package with premium features',
  price: 199.99,
  features: '["Premium ingredients", "Professional service", "Custom menu"]',
  is_popular: true,
  display_order: 1
};

describe('createPackage', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a package', async () => {
    const result = await createPackage(testInput);

    // Basic field validation
    expect(result.name).toEqual('Premium Package');
    expect(result.description).toEqual(testInput.description);
    expect(result.price).toEqual(199.99);
    expect(typeof result.price).toBe('number');
    expect(result.features).toEqual(testInput.features);
    expect(result.is_popular).toEqual(true);
    expect(result.is_active).toEqual(true);
    expect(result.display_order).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save package to database', async () => {
    const result = await createPackage(testInput);

    // Query using proper drizzle syntax
    const packages = await db.select()
      .from(packagesTable)
      .where(eq(packagesTable.id, result.id))
      .execute();

    expect(packages).toHaveLength(1);
    expect(packages[0].name).toEqual('Premium Package');
    expect(packages[0].description).toEqual(testInput.description);
    expect(parseFloat(packages[0].price)).toEqual(199.99);
    expect(packages[0].features).toEqual(testInput.features);
    expect(packages[0].is_popular).toEqual(true);
    expect(packages[0].is_active).toEqual(true);
    expect(packages[0].display_order).toEqual(1);
    expect(packages[0].created_at).toBeInstanceOf(Date);
    expect(packages[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle optional is_popular field defaulting to false', async () => {
    const inputWithoutPopular: CreatePackageInput = {
      name: 'Basic Package',
      description: 'A basic catering package',
      price: 99.99,
      features: '["Basic ingredients", "Standard service"]',
      display_order: 2
    };

    const result = await createPackage(inputWithoutPopular);

    expect(result.is_popular).toEqual(false);
    expect(result.is_active).toEqual(true); // Default from database
  });

  it('should handle different price values correctly', async () => {
    const expensivePackage: CreatePackageInput = {
      name: 'Luxury Package',
      description: 'The most expensive package',
      price: 1999.50,
      features: '["Luxury ingredients"]',
      display_order: 0
    };

    const result = await createPackage(expensivePackage);

    expect(result.price).toEqual(1999.50);
    expect(typeof result.price).toBe('number');

    // Verify in database
    const packages = await db.select()
      .from(packagesTable)
      .where(eq(packagesTable.id, result.id))
      .execute();

    expect(parseFloat(packages[0].price)).toEqual(1999.50);
  });
});


import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { menuItemsTable } from '../db/schema';
import { type CreateMenuItemInput } from '../schema';
import { createMenuItem } from '../handlers/create_menu_item';
import { eq } from 'drizzle-orm';

// Test input with all fields
const testInput: CreateMenuItemInput = {
  name: 'Beef Rendang',
  description: 'Traditional Indonesian slow-cooked beef curry',
  category: 'Main Course',
  image_url: 'https://example.com/beef-rendang.jpg',
  is_halal_certified: true,
  display_order: 1
};

describe('createMenuItem', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a menu item with all fields', async () => {
    const result = await createMenuItem(testInput);

    // Basic field validation
    expect(result.name).toEqual('Beef Rendang');
    expect(result.description).toEqual('Traditional Indonesian slow-cooked beef curry');
    expect(result.category).toEqual('Main Course');
    expect(result.image_url).toEqual('https://example.com/beef-rendang.jpg');
    expect(result.is_halal_certified).toEqual(true);
    expect(result.display_order).toEqual(1);
    expect(result.is_active).toEqual(true); // Default value
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a menu item with minimal fields', async () => {
    const minimalInput: CreateMenuItemInput = {
      name: 'Simple Dish',
      description: null,
      category: 'Appetizer',
      image_url: null,
      display_order: 0
    };

    const result = await createMenuItem(minimalInput);

    expect(result.name).toEqual('Simple Dish');
    expect(result.description).toBeNull();
    expect(result.category).toEqual('Appetizer');
    expect(result.image_url).toBeNull();
    expect(result.is_halal_certified).toEqual(true); // Default value when not provided
    expect(result.display_order).toEqual(0);
    expect(result.is_active).toEqual(true);
  });

  it('should save menu item to database', async () => {
    const result = await createMenuItem(testInput);

    // Query using proper drizzle syntax
    const menuItems = await db.select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, result.id))
      .execute();

    expect(menuItems).toHaveLength(1);
    expect(menuItems[0].name).toEqual('Beef Rendang');
    expect(menuItems[0].description).toEqual('Traditional Indonesian slow-cooked beef curry');
    expect(menuItems[0].category).toEqual('Main Course');
    expect(menuItems[0].is_halal_certified).toEqual(true);
    expect(menuItems[0].display_order).toEqual(1);
    expect(menuItems[0].is_active).toEqual(true);
    expect(menuItems[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle is_halal_certified default correctly', async () => {
    const inputWithoutHalal: CreateMenuItemInput = {
      name: 'Test Dish',
      description: 'Test description',
      category: 'Test Category',
      image_url: null,
      display_order: 0
      // is_halal_certified not provided
    };

    const result = await createMenuItem(inputWithoutHalal);

    expect(result.is_halal_certified).toEqual(true);

    // Verify in database
    const menuItems = await db.select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, result.id))
      .execute();

    expect(menuItems[0].is_halal_certified).toEqual(true);
  });

  it('should respect explicit is_halal_certified value', async () => {
    const inputNotHalal: CreateMenuItemInput = {
      name: 'Non-Halal Dish',
      description: 'Contains pork',
      category: 'Main Course',
      image_url: null,
      is_halal_certified: false,
      display_order: 1
    };

    const result = await createMenuItem(inputNotHalal);

    expect(result.is_halal_certified).toEqual(false);

    // Verify in database
    const menuItems = await db.select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.id, result.id))
      .execute();

    expect(menuItems[0].is_halal_certified).toEqual(false);
  });
});

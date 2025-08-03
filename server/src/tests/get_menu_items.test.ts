
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { menuItemsTable } from '../db/schema';
import { type CreateMenuItemInput } from '../schema';
import { getMenuItems } from '../handlers/get_menu_items';

// Test data for different scenarios
const appetizer1: CreateMenuItemInput = {
  name: 'Spring Rolls',
  description: 'Crispy vegetable spring rolls',
  category: 'Appetizer',
  image_url: 'spring-rolls.jpg',
  is_halal_certified: true,
  display_order: 1
};

const appetizer2: CreateMenuItemInput = {
  name: 'Chicken Wings',
  description: 'Spicy chicken wings',
  category: 'Appetizer',
  image_url: 'wings.jpg',
  is_halal_certified: true,
  display_order: 2
};

const mainCourse: CreateMenuItemInput = {
  name: 'Beef Rendang',
  description: 'Traditional Indonesian beef curry',
  category: 'Main Course',
  image_url: 'rendang.jpg',
  is_halal_certified: true,
  display_order: 1
};

const inactiveItem: CreateMenuItemInput = {
  name: 'Inactive Item',
  description: 'This should not appear',
  category: 'Appetizer',
  image_url: null,
  is_halal_certified: true,
  display_order: 0
};

describe('getMenuItems', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no menu items exist', async () => {
    const result = await getMenuItems();
    expect(result).toEqual([]);
  });

  it('should return all active menu items', async () => {
    // Create test menu items
    await db.insert(menuItemsTable).values([
      {
        name: appetizer1.name,
        description: appetizer1.description,
        category: appetizer1.category,
        image_url: appetizer1.image_url,
        is_halal_certified: appetizer1.is_halal_certified || true,
        display_order: appetizer1.display_order
      },
      {
        name: mainCourse.name,
        description: mainCourse.description,
        category: mainCourse.category,
        image_url: mainCourse.image_url,
        is_halal_certified: mainCourse.is_halal_certified || true,
        display_order: mainCourse.display_order
      }
    ]).execute();

    const result = await getMenuItems();

    expect(result).toHaveLength(2);
    expect(result[0].name).toEqual('Spring Rolls');
    expect(result[0].category).toEqual('Appetizer');
    expect(result[0].is_halal_certified).toBe(true);
    expect(result[1].name).toEqual('Beef Rendang');
    expect(result[1].category).toEqual('Main Course');
  });

  it('should exclude inactive menu items', async () => {
    // Create active and inactive items
    await db.insert(menuItemsTable).values([
      {
        name: appetizer1.name,
        description: appetizer1.description,
        category: appetizer1.category,
        image_url: appetizer1.image_url,
        is_halal_certified: appetizer1.is_halal_certified || true,
        display_order: appetizer1.display_order,
        is_active: true
      },
      {
        name: inactiveItem.name,
        description: inactiveItem.description,
        category: inactiveItem.category,
        image_url: inactiveItem.image_url,
        is_halal_certified: inactiveItem.is_halal_certified || true,
        display_order: inactiveItem.display_order,
        is_active: false
      }
    ]).execute();

    const result = await getMenuItems();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Spring Rolls');
    expect(result[0].is_active).toBe(true);
  });

  it('should order items by category then display_order', async () => {
    // Create items in different order to test sorting
    await db.insert(menuItemsTable).values([
      {
        name: mainCourse.name,
        description: mainCourse.description,
        category: mainCourse.category,
        image_url: mainCourse.image_url,
        is_halal_certified: mainCourse.is_halal_certified || true,
        display_order: mainCourse.display_order
      },
      {
        name: appetizer2.name,
        description: appetizer2.description,
        category: appetizer2.category,
        image_url: appetizer2.image_url,
        is_halal_certified: appetizer2.is_halal_certified || true,
        display_order: appetizer2.display_order
      },
      {
        name: appetizer1.name,
        description: appetizer1.description,
        category: appetizer1.category,
        image_url: appetizer1.image_url,
        is_halal_certified: appetizer1.is_halal_certified || true,
        display_order: appetizer1.display_order
      }
    ]).execute();

    const result = await getMenuItems();

    expect(result).toHaveLength(3);
    
    // Should be ordered by category first (Appetizer before Main Course)
    expect(result[0].category).toEqual('Appetizer');
    expect(result[1].category).toEqual('Appetizer');
    expect(result[2].category).toEqual('Main Course');
    
    // Within same category, should be ordered by display_order
    expect(result[0].name).toEqual('Spring Rolls'); // display_order: 1
    expect(result[1].name).toEqual('Chicken Wings'); // display_order: 2
    expect(result[2].name).toEqual('Beef Rendang'); // display_order: 1
  });

  it('should include all required fields', async () => {
    await db.insert(menuItemsTable).values({
      name: appetizer1.name,
      description: appetizer1.description,
      category: appetizer1.category,
      image_url: appetizer1.image_url,
      is_halal_certified: appetizer1.is_halal_certified || true,
      display_order: appetizer1.display_order
    }).execute();

    const result = await getMenuItems();

    expect(result).toHaveLength(1);
    const menuItem = result[0];
    
    expect(menuItem.id).toBeDefined();
    expect(menuItem.name).toEqual('Spring Rolls');
    expect(menuItem.description).toEqual('Crispy vegetable spring rolls');
    expect(menuItem.category).toEqual('Appetizer');
    expect(menuItem.image_url).toEqual('spring-rolls.jpg');
    expect(menuItem.is_halal_certified).toBe(true);
    expect(menuItem.display_order).toEqual(1);
    expect(menuItem.is_active).toBe(true);
    expect(menuItem.created_at).toBeInstanceOf(Date);
  });
});

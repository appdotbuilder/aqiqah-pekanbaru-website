
import { db } from '../db';
import { menuItemsTable } from '../db/schema';
import { type CreateMenuItemInput, type MenuItem } from '../schema';

export const createMenuItem = async (input: CreateMenuItemInput): Promise<MenuItem> => {
  try {
    // Insert menu item record
    const result = await db.insert(menuItemsTable)
      .values({
        name: input.name,
        description: input.description,
        category: input.category,
        image_url: input.image_url,
        is_halal_certified: input.is_halal_certified ?? true, // Use default if not provided
        display_order: input.display_order
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Menu item creation failed:', error);
    throw error;
  }
};

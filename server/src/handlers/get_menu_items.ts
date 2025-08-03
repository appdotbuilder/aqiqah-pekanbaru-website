
import { db } from '../db';
import { menuItemsTable } from '../db/schema';
import { type MenuItem } from '../schema';
import { eq, asc } from 'drizzle-orm';

export async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const results = await db.select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.is_active, true))
      .orderBy(asc(menuItemsTable.category), asc(menuItemsTable.display_order))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    throw error;
  }
}

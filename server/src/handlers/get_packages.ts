
import { db } from '../db';
import { packagesTable } from '../db/schema';
import { type Package } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getPackages = async (): Promise<Package[]> => {
  try {
    const results = await db.select()
      .from(packagesTable)
      .where(eq(packagesTable.is_active, true))
      .orderBy(asc(packagesTable.display_order))
      .execute();

    // Convert numeric fields back to numbers
    return results.map(pkg => ({
      ...pkg,
      price: parseFloat(pkg.price) // Convert string back to number
    }));
  } catch (error) {
    console.error('Get packages failed:', error);
    throw error;
  }
};

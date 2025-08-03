
import { db } from '../db';
import { serviceAdvantagesTable } from '../db/schema';
import { type ServiceAdvantage } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getServiceAdvantages = async (): Promise<ServiceAdvantage[]> => {
  try {
    const results = await db.select()
      .from(serviceAdvantagesTable)
      .where(eq(serviceAdvantagesTable.is_active, true))
      .orderBy(asc(serviceAdvantagesTable.display_order))
      .execute();

    return results;
  } catch (error) {
    console.error('Get service advantages failed:', error);
    throw error;
  }
};


import { db } from '../db';
import { serviceOfferingsTable } from '../db/schema';
import { type ServiceOffering } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getServiceOfferings = async (): Promise<ServiceOffering[]> => {
  try {
    const results = await db.select()
      .from(serviceOfferingsTable)
      .where(eq(serviceOfferingsTable.is_active, true))
      .orderBy(asc(serviceOfferingsTable.display_order))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch service offerings:', error);
    throw error;
  }
};

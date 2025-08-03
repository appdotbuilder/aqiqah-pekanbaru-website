
import { db } from '../db';
import { faqsTable } from '../db/schema';
import { type FAQ } from '../schema';
import { eq, asc } from 'drizzle-orm';

export async function getFAQs(): Promise<FAQ[]> {
  try {
    const results = await db.select()
      .from(faqsTable)
      .where(eq(faqsTable.is_active, true))
      .orderBy(asc(faqsTable.display_order))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    throw error;
  }
}

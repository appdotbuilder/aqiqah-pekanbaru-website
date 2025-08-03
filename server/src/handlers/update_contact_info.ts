
import { db } from '../db';
import { contactInfoTable } from '../db/schema';
import { type UpdateContactInfoInput, type ContactInfo } from '../schema';
import { eq } from 'drizzle-orm';

export const updateContactInfo = async (input: UpdateContactInfoInput): Promise<ContactInfo> => {
  try {
    // First, check if contact info exists
    const existing = await db.select()
      .from(contactInfoTable)
      .limit(1)
      .execute();

    if (existing.length === 0) {
      throw new Error('Contact information not found');
    }

    const contactId = existing[0].id;

    // Update contact info with provided fields
    const result = await db.update(contactInfoTable)
      .set({
        ...input,
        updated_at: new Date()
      })
      .where(eq(contactInfoTable.id, contactId))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Contact info update failed:', error);
    throw error;
  }
};

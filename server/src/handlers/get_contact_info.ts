
import { db } from '../db';
import { contactInfoTable } from '../db/schema';
import { type ContactInfo } from '../schema';

export const getContactInfo = async (): Promise<ContactInfo | null> => {
  try {
    const result = await db.select()
      .from(contactInfoTable)
      .limit(1)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error('Failed to get contact info:', error);
    throw error;
  }
};

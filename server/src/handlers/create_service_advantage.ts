
import { db } from '../db';
import { serviceAdvantagesTable } from '../db/schema';
import { type CreateServiceAdvantageInput, type ServiceAdvantage } from '../schema';

export const createServiceAdvantage = async (input: CreateServiceAdvantageInput): Promise<ServiceAdvantage> => {
  try {
    // Insert service advantage record
    const result = await db.insert(serviceAdvantagesTable)
      .values({
        title: input.title,
        description: input.description,
        icon_name: input.icon_name,
        display_order: input.display_order
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Service advantage creation failed:', error);
    throw error;
  }
};

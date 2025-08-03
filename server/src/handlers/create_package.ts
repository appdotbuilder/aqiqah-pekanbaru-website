
import { db } from '../db';
import { packagesTable } from '../db/schema';
import { type CreatePackageInput, type Package } from '../schema';

export const createPackage = async (input: CreatePackageInput): Promise<Package> => {
  try {
    // Insert package record
    const result = await db.insert(packagesTable)
      .values({
        name: input.name,
        description: input.description,
        price: input.price.toString(), // Convert number to string for numeric column
        features: input.features,
        is_popular: input.is_popular || false,
        display_order: input.display_order
      })
      .returning()
      .execute();

    // Convert numeric fields back to numbers before returning
    const package_ = result[0];
    return {
      ...package_,
      price: parseFloat(package_.price) // Convert string back to number
    };
  } catch (error) {
    console.error('Package creation failed:', error);
    throw error;
  }
};

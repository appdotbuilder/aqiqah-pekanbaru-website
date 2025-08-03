
import { db } from '../db';
import { heroSectionsTable } from '../db/schema';
import { type HeroSection } from '../schema';
import { eq } from 'drizzle-orm';

export const getHeroSection = async (): Promise<HeroSection | null> => {
  try {
    // Get the active hero section
    const results = await db.select()
      .from(heroSectionsTable)
      .where(eq(heroSectionsTable.is_active, true))
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    const heroSection = results[0];
    return {
      ...heroSection,
      // Ensure proper date objects are returned
      created_at: heroSection.created_at,
      updated_at: heroSection.updated_at
    };
  } catch (error) {
    console.error('Failed to get hero section:', error);
    throw error;
  }
};

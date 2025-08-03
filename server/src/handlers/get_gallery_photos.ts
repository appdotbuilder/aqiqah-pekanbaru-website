
import { db } from '../db';
import { galleryPhotosTable } from '../db/schema';
import { type GalleryPhoto } from '../schema';
import { eq, asc } from 'drizzle-orm';

export const getGalleryPhotos = async (): Promise<GalleryPhoto[]> => {
  try {
    const results = await db.select()
      .from(galleryPhotosTable)
      .where(eq(galleryPhotosTable.is_active, true))
      .orderBy(asc(galleryPhotosTable.display_order))
      .execute();

    return results;
  } catch (error) {
    console.error('Gallery photos retrieval failed:', error);
    throw error;
  }
};


import { db } from '../db';
import { galleryPhotosTable } from '../db/schema';
import { type CreateGalleryPhotoInput, type GalleryPhoto } from '../schema';

export const createGalleryPhoto = async (input: CreateGalleryPhotoInput): Promise<GalleryPhoto> => {
  try {
    // Insert gallery photo record
    const result = await db.insert(galleryPhotosTable)
      .values({
        title: input.title,
        description: input.description,
        image_url: input.image_url,
        thumbnail_url: input.thumbnail_url,
        category: input.category,
        display_order: input.display_order
      })
      .returning()
      .execute();

    // Return the created gallery photo
    const galleryPhoto = result[0];
    return galleryPhoto;
  } catch (error) {
    console.error('Gallery photo creation failed:', error);
    throw error;
  }
};

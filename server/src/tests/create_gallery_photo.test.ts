
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { galleryPhotosTable } from '../db/schema';
import { type CreateGalleryPhotoInput } from '../schema';
import { createGalleryPhoto } from '../handlers/create_gallery_photo';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateGalleryPhotoInput = {
  title: 'Test Photo',
  description: 'A beautiful test photo',
  image_url: 'https://example.com/test-photo.jpg',
  thumbnail_url: 'https://example.com/test-photo-thumb.jpg',
  category: 'Events',
  display_order: 1
};

describe('createGalleryPhoto', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a gallery photo', async () => {
    const result = await createGalleryPhoto(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Photo');
    expect(result.description).toEqual('A beautiful test photo');
    expect(result.image_url).toEqual('https://example.com/test-photo.jpg');
    expect(result.thumbnail_url).toEqual('https://example.com/test-photo-thumb.jpg');
    expect(result.category).toEqual('Events');
    expect(result.display_order).toEqual(1);
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save gallery photo to database', async () => {
    const result = await createGalleryPhoto(testInput);

    // Query using proper drizzle syntax
    const photos = await db.select()
      .from(galleryPhotosTable)
      .where(eq(galleryPhotosTable.id, result.id))
      .execute();

    expect(photos).toHaveLength(1);
    expect(photos[0].title).toEqual('Test Photo');
    expect(photos[0].description).toEqual('A beautiful test photo');
    expect(photos[0].image_url).toEqual('https://example.com/test-photo.jpg');
    expect(photos[0].thumbnail_url).toEqual('https://example.com/test-photo-thumb.jpg');
    expect(photos[0].category).toEqual('Events');
    expect(photos[0].display_order).toEqual(1);
    expect(photos[0].is_active).toEqual(true);
    expect(photos[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle null values correctly', async () => {
    const inputWithNulls: CreateGalleryPhotoInput = {
      title: null,
      description: null,
      image_url: 'https://example.com/required-image.jpg',
      thumbnail_url: null,
      category: null,
      display_order: 0
    };

    const result = await createGalleryPhoto(inputWithNulls);

    expect(result.title).toBeNull();
    expect(result.description).toBeNull();
    expect(result.image_url).toEqual('https://example.com/required-image.jpg');
    expect(result.thumbnail_url).toBeNull();
    expect(result.category).toBeNull();
    expect(result.display_order).toEqual(0);
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create multiple gallery photos with different display orders', async () => {
    const firstPhoto = await createGalleryPhoto({
      ...testInput,
      title: 'First Photo',
      display_order: 1
    });

    const secondPhoto = await createGalleryPhoto({
      ...testInput,
      title: 'Second Photo',
      display_order: 2
    });

    expect(firstPhoto.display_order).toEqual(1);
    expect(secondPhoto.display_order).toEqual(2);
    expect(firstPhoto.id).not.toEqual(secondPhoto.id);

    // Verify both are saved in database
    const allPhotos = await db.select()
      .from(galleryPhotosTable)
      .execute();

    expect(allPhotos).toHaveLength(2);
  });
});

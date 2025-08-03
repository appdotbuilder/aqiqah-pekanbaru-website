
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { galleryPhotosTable } from '../db/schema';
import { getGalleryPhotos } from '../handlers/get_gallery_photos';

describe('getGalleryPhotos', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no photos exist', async () => {
    const result = await getGalleryPhotos();
    expect(result).toEqual([]);
  });

  it('should return all active gallery photos', async () => {
    // Create test photos
    await db.insert(galleryPhotosTable).values([
      {
        title: 'Photo 1',
        description: 'Description 1',
        image_url: 'https://example.com/photo1.jpg',
        thumbnail_url: 'https://example.com/thumb1.jpg',
        category: 'events',
        display_order: 1,
        is_active: true
      },
      {
        title: 'Photo 2',
        description: 'Description 2',
        image_url: 'https://example.com/photo2.jpg',
        thumbnail_url: null,
        category: 'food',
        display_order: 2,
        is_active: true
      }
    ]).execute();

    const result = await getGalleryPhotos();

    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('Photo 1');
    expect(result[0].image_url).toEqual('https://example.com/photo1.jpg');
    expect(result[0].is_active).toBe(true);
    expect(result[1].title).toEqual('Photo 2');
    expect(result[1].thumbnail_url).toBeNull();
  });

  it('should exclude inactive photos', async () => {
    // Create active and inactive photos
    await db.insert(galleryPhotosTable).values([
      {
        title: 'Active Photo',
        description: 'Active description',
        image_url: 'https://example.com/active.jpg',
        display_order: 1,
        is_active: true
      },
      {
        title: 'Inactive Photo',
        description: 'Inactive description',
        image_url: 'https://example.com/inactive.jpg',
        display_order: 2,
        is_active: false
      }
    ]).execute();

    const result = await getGalleryPhotos();

    expect(result).toHaveLength(1);
    expect(result[0].title).toEqual('Active Photo');
    expect(result[0].is_active).toBe(true);
  });

  it('should return photos ordered by display_order', async () => {
    // Create photos in reverse order
    await db.insert(galleryPhotosTable).values([
      {
        title: 'Third Photo',
        image_url: 'https://example.com/photo3.jpg',
        display_order: 3,
        is_active: true
      },
      {
        title: 'First Photo',
        image_url: 'https://example.com/photo1.jpg',
        display_order: 1,
        is_active: true
      },
      {
        title: 'Second Photo',
        image_url: 'https://example.com/photo2.jpg',
        display_order: 2,
        is_active: true
      }
    ]).execute();

    const result = await getGalleryPhotos();

    expect(result).toHaveLength(3);
    expect(result[0].title).toEqual('First Photo');
    expect(result[0].display_order).toEqual(1);
    expect(result[1].title).toEqual('Second Photo');
    expect(result[1].display_order).toEqual(2);
    expect(result[2].title).toEqual('Third Photo');
    expect(result[2].display_order).toEqual(3);
  });

  it('should include all required fields', async () => {
    await db.insert(galleryPhotosTable).values({
      title: 'Test Photo',
      description: 'Test description',
      image_url: 'https://example.com/test.jpg',
      thumbnail_url: 'https://example.com/thumb.jpg',
      category: 'test',
      display_order: 1,
      is_active: true
    }).execute();

    const result = await getGalleryPhotos();

    expect(result).toHaveLength(1);
    const photo = result[0];
    expect(photo.id).toBeDefined();
    expect(photo.title).toBeDefined();
    expect(photo.description).toBeDefined();
    expect(photo.image_url).toBeDefined();
    expect(photo.thumbnail_url).toBeDefined();
    expect(photo.category).toBeDefined();
    expect(photo.display_order).toBeDefined();
    expect(photo.is_active).toBeDefined();
    expect(photo.created_at).toBeInstanceOf(Date);
  });
});

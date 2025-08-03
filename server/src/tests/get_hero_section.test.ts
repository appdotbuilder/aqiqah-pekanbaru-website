
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { heroSectionsTable } from '../db/schema';
import { getHeroSection } from '../handlers/get_hero_section';

describe('getHeroSection', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no hero section exists', async () => {
    const result = await getHeroSection();
    expect(result).toBeNull();
  });

  it('should return null when no active hero section exists', async () => {
    // Create inactive hero section
    await db.insert(heroSectionsTable).values({
      title: 'Inactive Hero',
      subtitle: 'Test subtitle',
      description: 'Test description',
      whatsapp_number: '+1234567890',
      whatsapp_message: 'Hello',
      is_active: false
    }).execute();

    const result = await getHeroSection();
    expect(result).toBeNull();
  });

  it('should return active hero section', async () => {
    // Create active hero section
    await db.insert(heroSectionsTable).values({
      title: 'Active Hero',
      subtitle: 'Welcome to our service',
      description: 'Professional catering services',
      whatsapp_number: '+1234567890',
      whatsapp_message: 'Hi, I would like to know more',
      background_image_url: 'https://example.com/hero.jpg',
      is_active: true
    }).execute();

    const result = await getHeroSection();

    expect(result).not.toBeNull();
    expect(result!.title).toBe('Active Hero');
    expect(result!.subtitle).toBe('Welcome to our service');
    expect(result!.description).toBe('Professional catering services');
    expect(result!.whatsapp_number).toBe('+1234567890');
    expect(result!.whatsapp_message).toBe('Hi, I would like to know more');
    expect(result!.background_image_url).toBe('https://example.com/hero.jpg');
    expect(result!.is_active).toBe(true);
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return first active hero section when multiple exist', async () => {
    // Create multiple active hero sections
    await db.insert(heroSectionsTable).values([
      {
        title: 'First Hero',
        subtitle: 'First subtitle',
        description: 'First description',
        whatsapp_number: '+1111111111',
        whatsapp_message: 'First message',
        is_active: true
      },
      {
        title: 'Second Hero',
        subtitle: 'Second subtitle',
        description: 'Second description',
        whatsapp_number: '+2222222222',
        whatsapp_message: 'Second message',
        is_active: true
      }
    ]).execute();

    const result = await getHeroSection();

    expect(result).not.toBeNull();
    expect(result!.title).toBe('First Hero');
    expect(result!.whatsapp_number).toBe('+1111111111');
  });

  it('should handle hero section with null background image', async () => {
    // Create hero section without background image
    await db.insert(heroSectionsTable).values({
      title: 'No Image Hero',
      subtitle: 'Test subtitle',
      description: 'Test description',
      whatsapp_number: '+1234567890',
      whatsapp_message: 'Hello',
      background_image_url: null,
      is_active: true
    }).execute();

    const result = await getHeroSection();

    expect(result).not.toBeNull();
    expect(result!.title).toBe('No Image Hero');
    expect(result!.background_image_url).toBeNull();
  });
});

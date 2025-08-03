
import { serial, text, pgTable, timestamp, numeric, integer, boolean } from 'drizzle-orm/pg-core';

export const heroSectionsTable = pgTable('hero_sections', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  description: text('description').notNull(),
  whatsapp_number: text('whatsapp_number').notNull(),
  whatsapp_message: text('whatsapp_message').notNull(),
  background_image_url: text('background_image_url'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const serviceAdvantagesTable = pgTable('service_advantages', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon_name: text('icon_name'),
  display_order: integer('display_order').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const serviceOfferingsTable = pgTable('service_offerings', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image_url: text('image_url'),
  display_order: integer('display_order').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const packagesTable = pgTable('packages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  features: text('features').notNull(), // JSON string
  is_popular: boolean('is_popular').notNull().default(false),
  is_active: boolean('is_active').notNull().default(true),
  display_order: integer('display_order').notNull().default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const menuItemsTable = pgTable('menu_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  image_url: text('image_url'),
  is_halal_certified: boolean('is_halal_certified').notNull().default(true),
  display_order: integer('display_order').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const galleryPhotosTable = pgTable('gallery_photos', {
  id: serial('id').primaryKey(),
  title: text('title'),
  description: text('description'),
  image_url: text('image_url').notNull(),
  thumbnail_url: text('thumbnail_url'),
  category: text('category'),
  display_order: integer('display_order').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const faqsTable = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category'),
  display_order: integer('display_order').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const contactInfoTable = pgTable('contact_info', {
  id: serial('id').primaryKey(),
  business_name: text('business_name').notNull(),
  address: text('address').notNull(),
  phone_number: text('phone_number').notNull(),
  whatsapp_number: text('whatsapp_number').notNull(),
  email: text('email'),
  operating_hours: text('operating_hours').notNull(),
  social_media_links: text('social_media_links'), // JSON string
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Export all tables for relation queries
export const tables = {
  heroSections: heroSectionsTable,
  serviceAdvantages: serviceAdvantagesTable,
  serviceOfferings: serviceOfferingsTable,
  packages: packagesTable,
  menuItems: menuItemsTable,
  galleryPhotos: galleryPhotosTable,
  faqs: faqsTable,
  contactInfo: contactInfoTable,
};

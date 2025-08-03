
import { z } from 'zod';

// Hero section schema
export const heroSectionSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  whatsapp_number: z.string(),
  whatsapp_message: z.string(),
  background_image_url: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type HeroSection = z.infer<typeof heroSectionSchema>;

// Service advantages schema
export const serviceAdvantageSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  icon_name: z.string().nullable(),
  display_order: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type ServiceAdvantage = z.infer<typeof serviceAdvantageSchema>;

// Service offerings schema
export const serviceOfferingSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  image_url: z.string().nullable(),
  display_order: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type ServiceOffering = z.infer<typeof serviceOfferingSchema>;

// Package schema
export const packageSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  features: z.string(), // JSON string of features array
  is_popular: z.boolean(),
  is_active: z.boolean(),
  display_order: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Package = z.infer<typeof packageSchema>;

// Menu item schema
export const menuItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  image_url: z.string().nullable(),
  is_halal_certified: z.boolean(),
  display_order: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type MenuItem = z.infer<typeof menuItemSchema>;

// Gallery photo schema
export const galleryPhotoSchema = z.object({
  id: z.number(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  image_url: z.string(),
  thumbnail_url: z.string().nullable(),
  category: z.string().nullable(),
  display_order: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type GalleryPhoto = z.infer<typeof galleryPhotoSchema>;

// FAQ schema
export const faqSchema = z.object({
  id: z.number(),
  question: z.string(),
  answer: z.string(),
  category: z.string().nullable(),
  display_order: z.number().int(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type FAQ = z.infer<typeof faqSchema>;

// Contact information schema
export const contactInfoSchema = z.object({
  id: z.number(),
  business_name: z.string(),
  address: z.string(),
  phone_number: z.string(),
  whatsapp_number: z.string(),
  email: z.string().nullable(),
  operating_hours: z.string(),
  social_media_links: z.string().nullable(), // JSON string of social media links
  updated_at: z.coerce.date()
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;

// Input schemas for creating/updating
export const createServiceAdvantageInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon_name: z.string().nullable(),
  display_order: z.number().int().nonnegative()
});

export type CreateServiceAdvantageInput = z.infer<typeof createServiceAdvantageInputSchema>;

export const createPackageInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  features: z.string(),
  is_popular: z.boolean().optional(),
  display_order: z.number().int().nonnegative()
});

export type CreatePackageInput = z.infer<typeof createPackageInputSchema>;

export const createMenuItemInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  image_url: z.string().nullable(),
  is_halal_certified: z.boolean().optional(),
  display_order: z.number().int().nonnegative()
});

export type CreateMenuItemInput = z.infer<typeof createMenuItemInputSchema>;

export const createGalleryPhotoInputSchema = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  image_url: z.string(),
  thumbnail_url: z.string().nullable(),
  category: z.string().nullable(),
  display_order: z.number().int().nonnegative()
});

export type CreateGalleryPhotoInput = z.infer<typeof createGalleryPhotoInputSchema>;

export const createFAQInputSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.string().nullable(),
  display_order: z.number().int().nonnegative()
});

export type CreateFAQInput = z.infer<typeof createFAQInputSchema>;

export const updateContactInfoInputSchema = z.object({
  business_name: z.string().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional(),
  whatsapp_number: z.string().optional(),
  email: z.string().nullable().optional(),
  operating_hours: z.string().optional(),
  social_media_links: z.string().nullable().optional()
});

export type UpdateContactInfoInput = z.infer<typeof updateContactInfoInputSchema>;

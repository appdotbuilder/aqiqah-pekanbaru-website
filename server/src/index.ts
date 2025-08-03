
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  createServiceAdvantageInputSchema,
  createPackageInputSchema,
  createMenuItemInputSchema,
  createGalleryPhotoInputSchema,
  createFAQInputSchema,
  updateContactInfoInputSchema
} from './schema';

// Import handlers
import { getHeroSection } from './handlers/get_hero_section';
import { getServiceAdvantages } from './handlers/get_service_advantages';
import { getServiceOfferings } from './handlers/get_service_offerings';
import { getPackages } from './handlers/get_packages';
import { getMenuItems } from './handlers/get_menu_items';
import { getGalleryPhotos } from './handlers/get_gallery_photos';
import { getFAQs } from './handlers/get_faqs';
import { getContactInfo } from './handlers/get_contact_info';
import { createServiceAdvantage } from './handlers/create_service_advantage';
import { createPackage } from './handlers/create_package';
import { createMenuItem } from './handlers/create_menu_item';
import { createGalleryPhoto } from './handlers/create_gallery_photo';
import { createFAQ } from './handlers/create_faq';
import { updateContactInfo } from './handlers/update_contact_info';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Get queries for website content
  getHeroSection: publicProcedure
    .query(() => getHeroSection()),
  getServiceAdvantages: publicProcedure
    .query(() => getServiceAdvantages()),
  getServiceOfferings: publicProcedure
    .query(() => getServiceOfferings()),
  getPackages: publicProcedure
    .query(() => getPackages()),
  getMenuItems: publicProcedure
    .query(() => getMenuItems()),
  getGalleryPhotos: publicProcedure
    .query(() => getGalleryPhotos()),
  getFAQs: publicProcedure
    .query(() => getFAQs()),
  getContactInfo: publicProcedure
    .query(() => getContactInfo()),
  
  // Create mutations for content management
  createServiceAdvantage: publicProcedure
    .input(createServiceAdvantageInputSchema)
    .mutation(({ input }) => createServiceAdvantage(input)),
  createPackage: publicProcedure
    .input(createPackageInputSchema)
    .mutation(({ input }) => createPackage(input)),
  createMenuItem: publicProcedure
    .input(createMenuItemInputSchema)
    .mutation(({ input }) => createMenuItem(input)),
  createGalleryPhoto: publicProcedure
    .input(createGalleryPhotoInputSchema)
    .mutation(({ input }) => createGalleryPhoto(input)),
  createFAQ: publicProcedure
    .input(createFAQInputSchema)
    .mutation(({ input }) => createFAQ(input)),
  updateContactInfo: publicProcedure
    .input(updateContactInfoInputSchema)
    .mutation(({ input }) => updateContactInfo(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();

/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Mock data fallbacks for development when DB is down or DATABASE_URL is not set
const mockProjects = [
  {
    id: '1',
    title: 'p1_title',
    slug: 'ecoyouth-exchange',
    country: 'p1_country',
    program: 'ESC',
    duration: 'p1_duration',
    description: 'p1_desc',
    results: 'p1_results',
    coverImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    isPublished: true,
    galleryImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'mock-admin-id'
  },
  {
    id: '2',
    title: 'p2_title',
    slug: 'palermo-social-inclusion',
    country: 'p2_country',
    program: 'ERASMUS_PLUS',
    duration: 'p2_duration',
    description: 'p2_desc',
    results: 'p2_results',
    coverImageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    isPublished: true,
    galleryImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'mock-admin-id'
  },
  {
    id: '3',
    title: 'p3_title',
    slug: 'digital-civic-lab',
    country: 'p3_country',
    program: 'YOUTH_PARTICIPATION',
    duration: 'p3_duration',
    description: 'p3_desc',
    results: 'p3_results',
    coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    isPublished: true,
    galleryImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'mock-admin-id'
  },
  {
    id: '4',
    title: 'p4_title',
    slug: 'green-transition-citizens',
    country: 'p4_country',
    program: 'CERV',
    duration: 'p4_duration',
    description: 'p4_desc',
    results: 'p4_results',
    coverImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    isPublished: true,
    galleryImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'mock-admin-id'
  },
  {
    id: '5',
    title: 'p5_title',
    slug: 'youth-mentors-alliance',
    country: 'p5_country',
    program: 'KA2',
    duration: 'p5_duration',
    description: 'p5_desc',
    results: 'p5_results',
    coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    isPublished: true,
    galleryImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'mock-admin-id'
  },
  {
    id: '6',
    title: 'p6_title',
    slug: 'democratic-leadership-exchange',
    country: 'p6_country',
    program: 'YOUTH_EXCHANGE',
    duration: 'p6_duration',
    description: 'p6_desc',
    results: 'p6_results',
    coverImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    isPublished: true,
    galleryImages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'mock-admin-id'
  }
];

const mockOpportunities = [
  {
    id: '1',
    title: 'o1_title',
    slug: 'esc-digital-education',
    type: 'VOLUNTEERING',
    location: 'o1_loc',
    duration: 'o1_dur',
    deadline: new Date('2026-06-30T23:59:59Z'),
    description: 'o1_desc',
    requirements: 'o1_req',
    coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'mock-admin-id'
  },
  {
    id: '2',
    title: 'o2_title',
    slug: 'digital-activism-art',
    type: 'TRAINING_COURSE',
    location: 'o2_loc',
    duration: 'o2_dur',
    deadline: new Date('2026-07-20T23:59:59Z'),
    description: 'o2_desc',
    requirements: 'o2_req',
    coverImageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'mock-admin-id'
  },
  {
    id: '3',
    title: 'o3_title',
    slug: 'urban-climate-action',
    type: 'YOUTH_EXCHANGE',
    location: 'o3_loc',
    duration: 'o3_dur',
    deadline: new Date('2026-08-15T23:59:59Z'),
    description: 'o3_desc',
    requirements: 'o3_req',
    coverImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'mock-admin-id'
  },
  {
    id: '4',
    title: 'o4_title',
    slug: 'esc-urban-farming',
    type: 'VOLUNTEERING',
    location: 'o4_loc',
    duration: 'o4_dur',
    deadline: new Date('2026-09-15T23:59:59Z'),
    description: 'o4_desc',
    requirements: 'o4_req',
    coverImageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'mock-admin-id'
  }
];

const mockPartners = [
  { id: '1', name: 'União Europeia', type: 'EUROPEAN_INSTITUTION', order: 1, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://european-union.europa.eu/', isPublished: true, createdAt: new Date() },
  { id: '2', name: 'Câmara Municipal de Lisboa', type: 'MUNICIPALITY', order: 2, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://www.lisboa.pt/', isPublished: true, createdAt: new Date() },
  { id: '3', name: 'IPDJ IP', type: 'NGO', order: 3, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://ipdj.gov.pt/', isPublished: true, createdAt: new Date() },
  { id: '4', name: 'Universidade de Lisboa', type: 'UNIVERSITY', order: 4, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://www.ulisboa.pt/', isPublished: true, createdAt: new Date() },
  { id: '5', name: 'CEIPES Itália', type: 'NGO', order: 5, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://ceipes.org/', isPublished: true, createdAt: new Date() },
  { id: '6', name: 'Adel Slovakia', type: 'NGO', order: 6, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://www.adelslovakia.org/', isPublished: true, createdAt: new Date() },
  { id: '7', name: 'Eramus+ Portugal', type: 'EUROPEAN_INSTITUTION', order: 7, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://www.erasmusmais.pt/', isPublished: true, createdAt: new Date() },
  { id: '8', name: 'Corpo Europeu Solidariedade', type: 'EUROPEAN_INSTITUTION', order: 8, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://youth.europa.eu/solidarity_en', isPublished: true, createdAt: new Date() },
];

const mockGalleryItems = [
  { id: '1', title: 'i1_title', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Erasmus+', createdAt: new Date() },
  { id: '2', title: 'i2_title', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Atividades', createdAt: new Date() },
  { id: '3', title: 'i3_title', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Voluntariado', createdAt: new Date() },
  { id: '4', title: 'i4_title', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Erasmus+', createdAt: new Date() },
  { id: '5', title: 'i5_title', url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Atividades', createdAt: new Date() },
  { id: '6', title: 'i6_title', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Erasmus+', createdAt: new Date() },
];

function getFallbackValue(model: string, method: string, args: any[]): any {
  const query = args[0] || {};
  if (method === 'findMany') {
    if (model === 'project') {
      return mockProjects.filter(p => !query.where || query.where.isPublished === undefined || p.isPublished === query.where.isPublished);
    }
    if (model === 'opportunity') {
      return mockOpportunities.filter(o => !query.where || query.where.isPublished === undefined || o.isPublished === query.where.isPublished);
    }
    if (model === 'partner') {
      return mockPartners.filter(p => !query.where || query.where.isPublished === undefined || p.isPublished === query.where.isPublished);
    }
    if (model === 'galleryItem') {
      return mockGalleryItems;
    }
    return [];
  }
  
  if (method === 'findUnique' || method === 'findFirst') {
    const where = query.where || {};
    if (model === 'project') {
      return mockProjects.find(p => p.id === where.id || p.slug === where.slug) || null;
    }
    if (model === 'opportunity') {
      return mockOpportunities.find(o => o.id === where.id || o.slug === where.slug) || null;
    }
    if (model === 'partner') {
      return mockPartners.find(p => p.id === where.id) || null;
    }
    if (model === 'galleryItem') {
      return mockGalleryItems.find(g => g.id === where.id) || null;
    }
    return null;
  }
  
  if (method === 'count') {
    if (model === 'project') return mockProjects.length;
    if (model === 'opportunity') return mockOpportunities.length;
    if (model === 'partner') return mockPartners.length;
    if (model === 'galleryItem') return mockGalleryItems.length;
    return 0;
  }
  
  if (method === 'create' || method === 'update' || method === 'upsert') {
    const data = query.create || query.update || query.data || {};
    return { id: 'mock-new-id', ...data, createdAt: new Date(), updatedAt: new Date() };
  }
  
  if (method === 'delete') {
    return { id: 'mock-deleted-id' };
  }
  
  return null;
}

let useFallbackMode = typeof process !== 'undefined' && !process.env.DATABASE_URL;

function wrapPrismaWithFallback(client: any): any {
  return new Proxy(client, {
    get(target, prop) {
      const value = target[prop];
      
      if (typeof prop === 'string' && prop.startsWith('$')) {
        return function(...args: any[]) {
          if (useFallbackMode) {
            return Promise.resolve();
          }
          if (typeof value === 'function') {
            try {
              const res = value.apply(target, args);
              if (res instanceof Promise) {
                return res.catch((err) => {
                  console.warn(`Prisma helper intercepted method error for ${String(prop)}:`, err.message);
                  useFallbackMode = true;
                  return Promise.resolve();
                });
              }
              return res;
            } catch (err: any) {
              console.warn(`Prisma helper intercepted sync error for ${String(prop)}:`, err.message);
              useFallbackMode = true;
              return Promise.resolve();
            }
          }
          return Promise.resolve();
        };
      }
      
      if (typeof prop === 'string' && !prop.startsWith('_')) {
        return new Proxy(value || {}, {
          get(modelTarget, modelProp) {
            const modelValue = modelTarget[modelProp];
            
            if (typeof modelProp === 'string') {
              return function(...args: any[]) {
                if (useFallbackMode) {
                  return Promise.resolve(getFallbackValue(prop, String(modelProp), args));
                }
                
                if (typeof modelValue === 'function') {
                  try {
                    const res = modelValue.apply(modelTarget, args);
                    if (res instanceof Promise) {
                      return res.catch((err) => {
                        console.warn(`Prisma intercepted error for ${prop}.${String(modelProp)}, switching to fallback mode:`, err.message);
                        useFallbackMode = true;
                        return getFallbackValue(prop, String(modelProp), args);
                      });
                    }
                    return res;
                  } catch (err: any) {
                    console.warn(`Prisma intercepted sync error for ${prop}.${String(modelProp)}, switching to fallback mode:`, err.message);
                    useFallbackMode = true;
                    return getFallbackValue(prop, String(modelProp), args);
                  }
                } else {
                  return Promise.resolve(getFallbackValue(prop, String(modelProp), args));
                }
              };
            }
            return modelValue;
          }
        });
      }
      
      return value;
    }
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  adapter: PrismaPg;
};

function createPrismaClient() {
  let client: any;
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not defined");
    }
    const adapter =
      globalForPrisma.adapter ??
      new PrismaPg({
        connectionString: process.env.DATABASE_URL,
        connectionTimeoutMillis: 5_000,
        idleTimeoutMillis: 300_000,
      });

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.adapter = adapter;
    }

    client = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (e: any) {
    console.warn("Could not initialize PrismaClient with PG adapter, using fallback mode:", e.message);
    useFallbackMode = true;
    try {
      client = new PrismaClient();
    } catch {
      client = {} as any;
    }
  }

  return wrapPrismaWithFallback(client);
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

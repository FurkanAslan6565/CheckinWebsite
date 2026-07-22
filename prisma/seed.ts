import { readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const content = readFileSync(envPath, "utf8");

    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;

      const key = trimmed.slice(0, separator).trim();
      const value = trimmed
        .slice(separator + 1)
        .trim()
        .replace(/^["']|["']$/g, "");

      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env is optional when variables are already exported
  }
}

loadEnvFile();

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://furkanaslan@localhost:5432/checkin";

const adapter = new PrismaPg({
  connectionString,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@checkin.org.pt" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@checkin.org.pt",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  // Seed default projects
  const defaultProjects = [
    {
      title: 'p1_title',
      slug: 'ecoyouth-exchange',
      country: 'p1_country',
      program: 'ESC' as const,
      duration: 'p1_duration',
      description: 'p1_desc',
      results: 'p1_results',
      coverImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE' as const,
      isPublished: true,
      authorId: admin.id,
    },
    {
      title: 'p2_title',
      slug: 'palermo-social-inclusion',
      country: 'p2_country',
      program: 'ERASMUS_PLUS' as const,
      duration: 'p2_duration',
      description: 'p2_desc',
      results: 'p2_results',
      coverImageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE' as const,
      isPublished: true,
      authorId: admin.id,
    },
    {
      title: 'p3_title',
      slug: 'digital-civic-lab',
      country: 'p3_country',
      program: 'YOUTH_PARTICIPATION' as const,
      duration: 'p3_duration',
      description: 'p3_desc',
      results: 'p3_results',
      coverImageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE' as const,
      isPublished: true,
      authorId: admin.id,
    },
    {
      title: 'p4_title',
      slug: 'green-transition-citizens',
      country: 'p4_country',
      program: 'CERV' as const,
      duration: 'p4_duration',
      description: 'p4_desc',
      results: 'p4_results',
      coverImageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE' as const,
      isPublished: true,
      authorId: admin.id,
    },
    {
      title: 'p5_title',
      slug: 'youth-mentors-alliance',
      country: 'p5_country',
      program: 'KA2' as const,
      duration: 'p5_duration',
      description: 'p5_desc',
      results: 'p5_results',
      coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE' as const,
      isPublished: true,
      authorId: admin.id,
    },
    {
      title: 'p6_title',
      slug: 'democratic-leadership-exchange',
      country: 'p6_country',
      program: 'YOUTH_EXCHANGE' as const,
      duration: 'p6_duration',
      description: 'p6_desc',
      results: 'p6_results',
      coverImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE' as const,
      isPublished: true,
      authorId: admin.id,
    },
  ];

  for (const proj of defaultProjects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: {},
      create: proj,
    });
  }

  // Seed default opportunities
  const defaultOpportunities = [
    {
      title: 'o1_title',
      slug: 'esc-digital-education',
      type: 'VOLUNTEERING' as const,
      location: 'o1_loc',
      duration: 'o1_dur',
      deadline: new Date('2026-06-30T23:59:59Z'),
      description: 'o1_desc',
      requirements: 'o1_req',
      coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      authorId: admin.id,
    },
    {
      title: 'o2_title',
      slug: 'digital-activism-art',
      type: 'TRAINING_COURSE' as const,
      location: 'o2_loc',
      duration: 'o2_dur',
      deadline: new Date('2026-07-20T23:59:59Z'),
      description: 'o2_desc',
      requirements: 'o2_req',
      coverImageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      authorId: admin.id,
    },
    {
      title: 'o3_title',
      slug: 'urban-climate-action',
      type: 'YOUTH_EXCHANGE' as const,
      location: 'o3_loc',
      duration: 'o3_dur',
      deadline: new Date('2026-08-15T23:59:59Z'),
      description: 'o3_desc',
      requirements: 'o3_req',
      coverImageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      authorId: admin.id,
    },
    {
      title: 'o4_title',
      slug: 'esc-urban-farming',
      type: 'VOLUNTEERING' as const,
      location: 'o4_loc',
      duration: 'o4_dur',
      deadline: new Date('2026-09-15T23:59:59Z'),
      description: 'o4_desc',
      requirements: 'o4_req',
      coverImageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
      isPublished: true,
      authorId: admin.id,
    },
  ];

  for (const opp of defaultOpportunities) {
    await prisma.opportunity.upsert({
      where: { slug: opp.slug },
      update: {},
      create: opp,
    });
  }

  // Seed default partners
  const defaultPartners = [
    { name: 'União Europeia', type: 'EUROPEAN_INSTITUTION' as const, order: 1, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://european-union.europa.eu/' },
    { name: 'Câmara Municipal de Lisboa', type: 'MUNICIPALITY' as const, order: 2, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://www.lisboa.pt/' },
    { name: 'IPDJ IP', type: 'NGO' as const, order: 3, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://ipdj.gov.pt/' },
    { name: 'Universidade de Lisboa', type: 'UNIVERSITY' as const, order: 4, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://www.ulisboa.pt/' },
    { name: 'CEIPES Itália', type: 'NGO' as const, order: 5, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://ceipes.org/' },
    { name: 'Adel Slovakia', type: 'NGO' as const, order: 6, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://www.adelslovakia.org/' },
    { name: 'Eramus+ Portugal', type: 'EUROPEAN_INSTITUTION' as const, order: 7, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://www.erasmusmais.pt/' },
    { name: 'Corpo Europeu Solidariedade', type: 'EUROPEAN_INSTITUTION' as const, order: 8, logoUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=80&q=80', websiteUrl: 'https://youth.europa.eu/solidarity_en' },
  ];

  for (const partner of defaultPartners) {
    const existing = await prisma.partner.findFirst({ where: { name: partner.name } });
    if (!existing) {
      await prisma.partner.create({ data: partner });
    }
  }

  // Seed default gallery items
  const defaultGalleryItems = [
    { title: 'i1_title', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Erasmus+' },
    { title: 'i2_title', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Atividades' },
    { title: 'i3_title', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Voluntariado' },
    { title: 'i4_title', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Erasmus+' },
    { title: 'i5_title', url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Atividades' },
    { title: 'i6_title', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80', isVideo: false, category: 'Erasmus+' },
  ];

  for (const item of defaultGalleryItems) {
    const existing = await prisma.galleryItem.findFirst({ where: { url: item.url } });
    if (!existing) {
      await prisma.galleryItem.create({ data: item });
    }
  }

  console.log("Seed completed:");
  console.log(`  Admin user: ${admin.email}`);
  console.log("  Default password: admin123");
  console.log("  Change this password after first login!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

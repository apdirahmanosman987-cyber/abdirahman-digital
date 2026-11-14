import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "oapdirahman466@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const adminName = process.env.ADMIN_NAME || "Abdirahman";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const owner = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: adminName },
    create: { email: adminEmail, passwordHash, name: adminName, role: "OWNER" },
  });

  console.log(`✓ Admin user ready: ${adminEmail}`);

  // --- Categories ---
  const [general, techCategory, notesTech, notesProgramming, portfolioWeb] = await Promise.all([
    prisma.category.upsert({ where: { slug_scope: { slug: "general", scope: "general" } }, update: {}, create: { name: "General", slug: "general", scope: "general" } }),
    prisma.category.upsert({ where: { slug_scope: { slug: "technology", scope: "general" } }, update: {}, create: { name: "Technology", slug: "technology", scope: "general" } }),
    prisma.category.upsert({ where: { slug_scope: { slug: "technology", scope: "note" } }, update: {}, create: { name: "Technology", slug: "technology", scope: "note" } }),
    prisma.category.upsert({ where: { slug_scope: { slug: "programming", scope: "note" } }, update: {}, create: { name: "Programming", slug: "programming", scope: "note" } }),
    prisma.category.upsert({ where: { slug_scope: { slug: "web-development", scope: "portfolio" } }, update: {}, create: { name: "Web Development", slug: "web-development", scope: "portfolio" } }),
  ]);

  console.log("✓ Categories seeded");

  // --- Tags ---
  const tagNames = ["nextjs", "typescript", "career", "life", "networking", "ai"];
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({ where: { slug: name }, update: {}, create: { name, slug: name } })
    )
  );

  console.log("✓ Tags seeded");

  // --- Skills ---
  const skillData = [
    { name: "Web Development", category: "Development", level: "ADVANCED" as const, order: 1 },
    { name: "PostgreSQL", category: "Databases", level: "INTERMEDIATE" as const, order: 2 },
    { name: "MySQL", category: "Databases", level: "INTERMEDIATE" as const, order: 3 },
    { name: "Networking", category: "IT & Infrastructure", level: "INTERMEDIATE" as const, order: 4 },
    { name: "CCTV / IP Camera Systems", category: "IT & Infrastructure", level: "INTERMEDIATE" as const, order: 5 },
    { name: "Graphic Design", category: "Design", level: "INTERMEDIATE" as const, order: 6 },
    { name: "Video Editing", category: "Design", level: "BEGINNER" as const, order: 7 },
    { name: "AI Tools", category: "Development", level: "INTERMEDIATE" as const, order: 8 },
    { name: "IT Support", category: "IT & Infrastructure", level: "ADVANCED" as const, order: 9 },
  ];
  for (const s of skillData) {
    const existing = await prisma.skill.findFirst({ where: { name: s.name } });
    if (!existing) await prisma.skill.create({ data: s });
  }
  console.log("✓ Skills seeded");

  // --- Services ---
  const serviceData = [
    { name: "Web Development", slug: "web-development", description: "Custom websites and web applications built with modern, reliable technology.", features: ["Responsive design", "SEO optimization", "Ongoing support"], order: 1, featured: true },
    { name: "IT Support & Networking", slug: "it-support-networking", description: "Setup, troubleshooting, and maintenance for networks and IT infrastructure.", features: ["Network setup", "CCTV installation", "Remote support"], order: 2 },
    { name: "Graphic Design", slug: "graphic-design", description: "Brand identity, social media graphics, and print design.", features: ["Logo design", "Social media kits", "Print materials"], order: 3 },
  ];
  for (const s of serviceData) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: s });
  }
  console.log("✓ Services seeded");

  // --- Statements ---
  await prisma.statement.upsert({
    where: { slug: "on-building-in-public" },
    update: {},
    create: {
      title: "On Building In Public",
      subtitle: "Why I choose to share my journey openly",
      slug: "on-building-in-public",
      content: "<p>I believe transparency builds trust. This platform exists to document what I learn, what I build, and what I believe — openly and honestly.</p>",
      status: "PUBLISHED",
      featured: true,
      readingTimeMins: 2,
      publishedAt: new Date(),
      categoryId: general.id,
      authorId: owner.id,
      tags: { create: [{ tagId: tags.find((t) => t.name === "life")!.id }] },
    },
  });
  console.log("✓ Sample statement seeded");

  // --- Announcements ---
  await prisma.announcement.upsert({
    where: { slug: "abdirahman-digital-is-live" },
    update: {},
    create: {
      title: "Abdirahman Digital is now live",
      slug: "abdirahman-digital-is-live",
      content: "<p>Welcome to my new personal digital platform — a space for statements, articles, notes, and the projects I'm building.</p>",
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date(),
      categoryId: general.id,
      authorId: owner.id,
    },
  });
  console.log("✓ Sample announcement seeded");

  // --- Articles ---
  await prisma.article.upsert({
    where: { slug: "getting-started-with-nextjs-and-prisma" },
    update: {},
    create: {
      title: "Getting Started with Next.js and Prisma",
      slug: "getting-started-with-nextjs-and-prisma",
      excerpt: "A practical introduction to building full-stack apps with Next.js App Router and Prisma ORM.",
      content: "<p>Next.js and Prisma make a powerful combination for building full-stack applications. In this article, I walk through the fundamentals of connecting a Next.js app to a PostgreSQL database using Prisma.</p><h2>Why this stack?</h2><p>Type safety end-to-end, great developer experience, and a clear path to production.</p>",
      status: "PUBLISHED",
      featured: true,
      readingTimeMins: 4,
      publishedAt: new Date(),
      categoryId: techCategory.id,
      authorId: owner.id,
      tags: { create: [{ tagId: tags.find((t) => t.name === "nextjs")!.id }, { tagId: tags.find((t) => t.name === "typescript")!.id }] },
    },
  });
  console.log("✓ Sample article seeded");

  // --- Notes ---
  await prisma.note.upsert({
    where: { slug: "postgresql-indexing-basics" },
    update: {},
    create: {
      title: "PostgreSQL Indexing Basics",
      slug: "postgresql-indexing-basics",
      content: "<p>Indexes speed up queries at the cost of slower writes and extra storage. Use them on columns you frequently filter or sort by.</p>",
      status: "PUBLISHED",
      categoryId: notesProgramming.id,
      authorId: owner.id,
    },
  });
  console.log("✓ Sample note seeded");

  // --- Thoughts ---
  await prisma.thought.upsert({
    where: { slug: "consistency-beats-intensity" },
    update: {},
    create: {
      title: "Consistency beats intensity",
      slug: "consistency-beats-intensity",
      text: "Showing up every day, even for 20 minutes, compounds faster than sporadic bursts of effort. Small and steady wins.",
      status: "PUBLISHED",
      categoryId: general.id,
      authorId: owner.id,
    },
  });
  console.log("✓ Sample thought seeded");

  // --- Portfolio ---
  await prisma.portfolioProject.upsert({
    where: { slug: "abdirahman-digital-platform" },
    update: {},
    create: {
      title: "Abdirahman Digital",
      slug: "abdirahman-digital-platform",
      description: "My personal digital platform — a publishing system, portfolio, and knowledge archive built with Next.js, Prisma, and PostgreSQL.",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
      featured: true,
      status: "PUBLISHED",
      categoryId: portfolioWeb.id,
      authorId: owner.id,
      completionDate: new Date(),
    },
  });
  console.log("✓ Sample portfolio project seeded");

  console.log("\n✅ Seed complete.");
  console.log(`\nLog in at /admin/login with:\n  Email: ${adminEmail}\n  Password: ${adminPassword}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

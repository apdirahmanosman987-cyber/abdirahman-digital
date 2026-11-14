import { z } from "zod";

export const statusEnum = z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]);

export const statementSchema = z.object({
  title: z.string().min(3).max(200),
  subtitle: z.string().max(300).optional().nullable(),
  content: z.string().min(1),
  featuredImage: z.string().url().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional().default([]),
  status: statusEnum.default("DRAFT"),
  featured: z.boolean().default(false),
  scheduledAt: z.string().datetime().optional().nullable(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
});

export const articleSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().max(300).optional().nullable(),
  content: z.string().min(1),
  coverImage: z.string().url().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional().default([]),
  status: statusEnum.default("DRAFT"),
  featured: z.boolean().default(false),
  scheduledAt: z.string().datetime().optional().nullable(),
  seoTitle: z.string().max(70).optional().nullable(),
  seoDescription: z.string().max(160).optional().nullable(),
  ogImage: z.string().url().optional().nullable(),
});

export const announcementSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(1),
  image: z.string().url().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional().default([]),
  status: statusEnum.default("DRAFT"),
  featured: z.boolean().default(false),
});

export const noteSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string().min(1),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional().default([]),
  status: statusEnum.default("DRAFT"),
});

export const thoughtSchema = z.object({
  title: z.string().max(200).optional().nullable(),
  text: z.string().min(1).max(2000),
  image: z.string().url().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional().default([]),
  status: statusEnum.default("DRAFT"),
});

export const portfolioSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(1),
  image: z.string().url().optional().nullable(),
  screenshots: z.array(z.string().url()).optional().default([]),
  technologies: z.array(z.string()).optional().default([]),
  projectUrl: z.string().url().optional().nullable(),
  githubUrl: z.string().url().optional().nullable(),
  completionDate: z.string().datetime().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional().default([]),
  featured: z.boolean().default(false),
  status: statusEnum.default("DRAFT"),
});

export const serviceSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(1),
  icon: z.string().max(50).optional().nullable(),
  features: z.array(z.string()).optional().default([]),
  price: z.string().max(100).optional().nullable(),
  availability: z.string().max(50).default("Available"),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const skillSchema = z.object({
  name: z.string().min(2).max(120),
  category: z.string().min(2).max(80),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).default("INTERMEDIATE"),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  order: z.number().int().default(0),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(80),
  scope: z.string().min(2).max(40).default("general"),
  description: z.string().max(300).optional().nullable(),
});

export const tagSchema = z.object({
  name: z.string().min(1).max(60),
});

// Public contact form — kept strict since it's the only unauthenticated write path
export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name is too short").max(120),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Subject is too short").max(150),
  message: z.string().min(10, "Message is too short").max(5000),
  // honeypot field — must stay empty; bots that fill it get silently rejected
  website: z.string().max(0).optional(),
});

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Base path relative to project root (demo/)
const contentBase = '../content';

const sitePages = defineCollection({
  loader: glob({ pattern: '*.md', base: `${contentBase}/site` }),
  schema: z.object({
    eyebrow: z.string().optional(),
    headline: z.string().optional(),
    headlineAccent: z.string().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    ctaPrimary: z.object({ label: z.string(), href: z.string() }).optional(),
    ctaSecondary: z.object({ label: z.string(), href: z.string() }).optional(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
    social: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
    linkedin: z.object({ label: z.string(), href: z.string() }).optional(),
    howIWork: z.array(z.object({ label: z.string(), detail: z.string() })).optional(),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: `${contentBase}/site/services` }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    icon: z.string(),
    cta: z.object({ label: z.string(), href: z.string() }).nullable(),
  }),
});

const topics = defineCollection({
  loader: glob({ pattern: '*.md', base: `${contentBase}/topics` }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    spotlight: z.boolean().default(false),
    spotlightDate: z.coerce.date().optional(),
    spotlightTitle: z.string().optional(),
    spotlightSummary: z.string().optional(),
    documents: z.array(z.object({
      file: z.string(),
      title: z.string(),
      description: z.string().optional(),
    })).default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: `${contentBase}/articles` }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    topic: z.string(),
    tags: z.array(z.string()),
    readTime: z.string(),
    draft: z.boolean().default(false),
  }),
});

const takes = defineCollection({
  loader: glob({ pattern: '*.md', base: `${contentBase}/takes` }),
  schema: z.object({
    hook: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    linkedArticle: z.string().optional(),
    socialLinks: z.array(z.object({
      platform: z.string(),
      url: z.string(),
    })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { sitePages, services, topics, articles, takes };

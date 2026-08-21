import { defineCollection, z } from "astro:content";

const services = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    order: z.number().default(0),
  }),
});

const testimonials = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    quote: z.string(),
    rating: z.number().min(1).max(5).default(5),
  }),
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    author: z.string().default("Flore Azzouz"),
    date: z.date(),
    readTime: z.string().optional(),
    excerpt: z.string(),
  }),
});

export const collections = { services, testimonials, blog };

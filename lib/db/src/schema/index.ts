import { z } from "zod/v4";

export const productCategoryValues = ["physical", "digital", "curriculum"] as const;
export type ProductCategory = (typeof productCategoryValues)[number];

export const insertProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.union([z.string(), z.number()]),
  category: z.enum(productCategoryValues),
  image_url: z.string(),
  gumroad_url: z.string().nullable().optional(),
  download_url: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  in_stock: z.boolean().default(true),
});
export type InsertProduct = z.infer<typeof insertProductSchema>;

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: ProductCategory;
  image_url: string;
  gumroad_url: string | null;
  download_url: string | null;
  featured: boolean;
  in_stock: boolean;
  created_at: string;
}

export const insertGallerySchema = z.object({
  title: z.string(),
  image_url: z.string(),
  description: z.string().nullable().optional(),
  sort_order: z.number().default(0),
});
export type InsertGallery = z.infer<typeof insertGallerySchema>;

export interface Gallery {
  id: number;
  title: string;
  image_url: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export const insertTutorialSchema = z.object({
  title: z.string(),
  youtube_id: z.string(),
  description: z.string().nullable().optional(),
  topic: z.string().nullable().optional(),
  featured: z.boolean().default(false),
  sort_order: z.number().default(0),
});
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;

export interface Tutorial {
  id: number;
  title: string;
  youtube_id: string;
  description: string | null;
  topic: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export const insertDownloadSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  file_url: z.string(),
  file_type: z.string(),
  thumbnail_url: z.string().nullable().optional(),
  sort_order: z.number().default(0),
});
export type InsertDownload = z.infer<typeof insertDownloadSchema>;

export interface Download {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  thumbnail_url: string | null;
  sort_order: number;
  created_at: string;
}

export const insertOrderSchema = z.object({
  stripe_session_id: z.string(),
  product_id: z.number(),
  customer_email: z.string().nullable().optional(),
  status: z.string().default("pending"),
  download_token: z.string().nullable().optional(),
  download_token_expires_at: z.string().nullable().optional(),
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export interface Order {
  id: number;
  stripe_session_id: string;
  product_id: number;
  customer_email: string | null;
  status: string;
  download_token: string | null;
  download_token_expires_at: string | null;
  created_at: string;
}

export const insertContactSchema = z.object({
  name: z.string(),
  email: z.string(),
  message: z.string(),
});
export type InsertContact = z.infer<typeof insertContactSchema>;

export interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

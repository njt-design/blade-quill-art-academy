import { pgTable, serial, text, boolean, decimal, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productCategoryEnum = pgEnum("product_category", ["physical", "digital", "curriculum"]);

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: productCategoryEnum("category").notNull(),
  imageUrl: text("image_url").notNull(),
  gumroadUrl: text("gumroad_url"),
  downloadUrl: text("download_url"),
  featured: boolean("featured").default(false).notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;

export const galleryTable = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGallerySchema = createInsertSchema(galleryTable).omit({ id: true, createdAt: true });
export type InsertGallery = z.infer<typeof insertGallerySchema>;
export type Gallery = typeof galleryTable.$inferSelect;

export const tutorialsTable = pgTable("tutorials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  youtubeId: text("youtube_id").notNull(),
  description: text("description"),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTutorialSchema = createInsertSchema(tutorialsTable).omit({ id: true, createdAt: true });
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type Tutorial = typeof tutorialsTable.$inferSelect;

export const downloadsTable = pgTable("downloads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDownloadSchema = createInsertSchema(downloadsTable).omit({ id: true, createdAt: true });
export type InsertDownload = z.infer<typeof insertDownloadSchema>;
export type Download = typeof downloadsTable.$inferSelect;

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  productId: integer("product_id").notNull(),
  customerEmail: text("customer_email"),
  status: text("status").notNull().default("pending"),
  downloadToken: text("download_token"),
  downloadTokenExpiresAt: timestamp("download_token_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;

export const contactsTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contactsTable).omit({ id: true, createdAt: true });
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactsTable.$inferSelect;

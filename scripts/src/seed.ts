import { db } from "@workspace/db";
import {
  productsTable,
  galleryTable,
  tutorialsTable,
  downloadsTable,
} from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  // Products
  await db.delete(productsTable);
  await db.insert(productsTable).values([
    {
      name: "Lheeloo & Luna Cartoon Book",
      description:
        "The official Lheeloo & Luna illustrated cartoon book by Corinne — a charming story full of personality and beautiful original artwork. Perfect for fans of cute, expressive character art. Ships as a physical paperback.",
      price: "24.99",
      category: "physical",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/b23e74de-dc37-4929-877b-ad77351f2844/THE+BOOK+IS+LIVE+%281%29.png",
      gumroadUrl: null,
      downloadUrl: null,
      featured: true,
      inStock: true,
    },
    {
      name: "Krita Quick Start Guide (eBook)",
      description:
        "Get started with Krita faster than ever with this comprehensive digital guide. Covers the essential tools, brushes, layers, blending modes, and workflows you need to create stunning digital art. Instant digital download.",
      price: "14.99",
      category: "digital",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1ece7ddd-670a-4cd3-922a-826e5cc59f6f/new+image+for+gumroad+%281280+x+720+px%29.png",
      gumroadUrl: "https://bladeandquillartacademy.com/krita-quick-start-guide-ebook",
      downloadUrl: null,
      featured: true,
      inStock: true,
    },
    {
      name: "Krita Keyboard Shortcuts Booklet",
      description:
        "Speed up your workflow! This handy shortcuts booklet covers all the essential Krita keyboard shortcuts. Print it out and keep it at your desk, or reference it digitally. Perfect for Krita beginners and intermediate artists.",
      price: "7.99",
      category: "digital",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/d14d7a10-7b62-45ee-a21b-426af152221b/Pin+leading+to+my+shortcut+booklet.jpg",
      gumroadUrl: "https://bladeandquillartacademy.com",
      downloadUrl: null,
      featured: false,
      inStock: true,
    },
    {
      name: "Blending Modes in Krita — Visual Guide",
      description:
        "Stop guessing what each blending mode does! This visual guide shows you exactly what each Krita blending mode looks like with real examples, so you can choose the right one instantly and create richer digital paintings.",
      price: "9.99",
      category: "digital",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg",
      gumroadUrl: "https://bladeandquillartacademy.com",
      downloadUrl: null,
      featured: false,
      inStock: true,
    },
    {
      name: "Digital Art Fundamentals Curriculum",
      description:
        "A complete beginner-to-intermediate curriculum for digital art. Covers drawing fundamentals, character design, digital painting techniques, and using Krita professionally. Includes lesson plans, practice exercises, and reference sheets. Great for self-study or classroom use.",
      price: "49.99",
      category: "curriculum",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg",
      gumroadUrl: null,
      downloadUrl: null,
      featured: true,
      inStock: true,
    },
  ]);
  console.log("✓ Products seeded");

  // Gallery
  await db.delete(galleryTable);
  await db.insert(galleryTable).values([
    {
      title: "Steampunk Cat",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1693251365287-G6KLJ7VG6WFGL29L2UVP/Steampunk+cat+August+2023.jpg",
      description: "A whimsical steampunk cat character — digital painting, August 2023",
      sortOrder: 1,
    },
    {
      title: "Baby Dragon",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432538976-2JJ0576R8S128MKNC3R6/Baby+dragon+with+signature+and+text.jpg",
      description: "An adorable baby dragon with rich digital color work",
      sortOrder: 2,
    },
    {
      title: "Baby Dragon 2",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432543865-A0BT3B52UBYU2PU85553/Baby+dragon2+with+signature+and+text.jpg",
      description: "Second version of the baby dragon character study",
      sortOrder: 3,
    },
    {
      title: "Chibi Geisha",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432548904-HPLDAUFZ93UUC7U40C1T/Chibi+Geisha+with+signature+and+text.jpg",
      description: "A chibi geisha character with intricate details",
      sortOrder: 4,
    },
    {
      title: "Kitty Princess",
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432558422-866Z4B4A91347XET1OLN/Kitty+princess+sketch+with+signature+and+text.jpg",
      description: "A regal kitty princess character sketch",
      sortOrder: 5,
    },
  ]);
  console.log("✓ Gallery seeded");

  // Tutorials
  await db.delete(tutorialsTable);
  await db.insert(tutorialsTable).values([
    {
      title: "Learn Different Ways to Remove Backgrounds in Krita",
      youtubeId: "63_gp_rFtOc",
      description:
        "Master background removal in Krita using multiple techniques — from the scissors tool to color selection and beyond.",
      featured: true,
      sortOrder: 1,
    },
    {
      title: "Turn Any Photograph into a Pencil Sketch Using Krita",
      youtubeId: "lgj0WPlwMGI",
      description:
        "A fun and easy technique to transform any photo into a beautiful pencil sketch using Krita's filters and tools.",
      featured: true,
      sortOrder: 2,
    },
    {
      title: "Fix Your Pen Pressure (FOR GOOD) in 5 Easy Steps",
      youtubeId: "Oe2xkeU_mV0",
      description:
        "Struggling with pen pressure in Krita? This tutorial walks you through 5 reliable steps to fix it permanently.",
      featured: true,
      sortOrder: 3,
    },
    {
      title: "Creating a Vector Image in Krita 4.4.3",
      youtubeId: "63_gp_rFtOc",
      description:
        "Learn how to create crisp, scalable vector images using Krita's vector tools — perfect for logos and illustrations.",
      featured: false,
      sortOrder: 4,
    },
    {
      title: "Krita Selection Tools — Complete Guide",
      youtubeId: "Oe2xkeU_mV0",
      description:
        "A comprehensive walkthrough of all Krita selection tools and when to use each one for precise, efficient editing.",
      featured: false,
      sortOrder: 5,
    },
    {
      title: "Faster Krita: Fix These 8 Lag Issues Now",
      youtubeId: "lgj0WPlwMGI",
      description:
        "Is Krita running slow? Learn how to identify and fix the 8 most common causes of lag and performance issues.",
      featured: false,
      sortOrder: 6,
    },
  ]);
  console.log("✓ Tutorials seeded");

  // Free Downloads
  await db.delete(downloadsTable);
  await db.insert(downloadsTable).values([
    {
      title: "Krita Blending Modes Quick Reference",
      description:
        "A printable quick-reference guide to all Krita blending modes with visual examples. Perfect to keep at your desk.",
      fileUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg",
      fileType: "PDF",
      thumbnailUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg",
      sortOrder: 1,
    },
    {
      title: "Krita Lag Fix Guide",
      description:
        "Free downloadable guide covering the top fixes for Krita lag and performance issues. Works for all system specs.",
      fileUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg",
      fileType: "PDF",
      thumbnailUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg",
      sortOrder: 2,
    },
    {
      title: "Lheeloo & Luna Coloring Page — Baby Dragon",
      description:
        "Free printable coloring page featuring the adorable baby dragon from Blade & Quill. Great for all ages!",
      fileUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432538976-2JJ0576R8S128MKNC3R6/Baby+dragon+with+signature+and+text.jpg",
      fileType: "PNG",
      thumbnailUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432538976-2JJ0576R8S128MKNC3R6/Baby+dragon+with+signature+and+text.jpg",
      sortOrder: 3,
    },
    {
      title: "Chibi Geisha Coloring Page",
      description:
        "Free printable coloring page of the chibi geisha character. Beautifully detailed for older kids and adults.",
      fileUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432548904-HPLDAUFZ93UUC7U40C1T/Chibi+Geisha+with+signature+and+text.jpg",
      fileType: "PNG",
      thumbnailUrl:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432548904-HPLDAUFZ93UUC7U40C1T/Chibi+Geisha+with+signature+and+text.jpg",
      sortOrder: 4,
    },
  ]);
  console.log("✓ Downloads seeded");

  console.log("\n✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});

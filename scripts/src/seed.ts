import { supabase } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  // Products
  await supabase.from("products").delete().neq("id", 0);
  const { error: prodErr } = await supabase.from("products").insert([
    {
      name: "Lheeloo & Luna Cartoon Book",
      description:
        "The official Lheeloo & Luna illustrated cartoon book by Corinne — a charming story full of personality and beautiful original artwork. Perfect for fans of cute, expressive character art. Ships as a physical paperback.",
      price: "24.99",
      category: "physical",
      image_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/b23e74de-dc37-4929-877b-ad77351f2844/THE+BOOK+IS+LIVE+%281%29.png",
      gumroad_url: null,
      download_url: null,
      featured: true,
      in_stock: true,
    },
    {
      name: "Krita Quick Start Guide (eBook)",
      description:
        "Get started with Krita faster than ever with this comprehensive digital guide. Covers the essential tools, brushes, layers, blending modes, and workflows you need to create stunning digital art. Instant digital download.",
      price: "14.99",
      category: "digital",
      image_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1ece7ddd-670a-4cd3-922a-826e5cc59f6f/new+image+for+gumroad+%281280+x+720+px%29.png",
      gumroad_url: "https://bladeandquillartacademy.com/krita-quick-start-guide-ebook",
      download_url: null,
      featured: true,
      in_stock: true,
    },
    {
      name: "Krita Keyboard Shortcuts Booklet",
      description:
        "Speed up your workflow! This handy shortcuts booklet covers all the essential Krita keyboard shortcuts. Print it out and keep it at your desk, or reference it digitally. Perfect for Krita beginners and intermediate artists.",
      price: "7.99",
      category: "digital",
      image_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/d14d7a10-7b62-45ee-a21b-426af152221b/Pin+leading+to+my+shortcut+booklet.jpg",
      gumroad_url: "https://bladeandquillartacademy.com",
      download_url: null,
      featured: false,
      in_stock: true,
    },
    {
      name: "Blending Modes in Krita — Visual Guide",
      description:
        "Stop guessing what each blending mode does! This visual guide shows you exactly what each Krita blending mode looks like with real examples, so you can choose the right one instantly and create richer digital paintings.",
      price: "9.99",
      category: "digital",
      image_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg",
      gumroad_url: "https://bladeandquillartacademy.com",
      download_url: null,
      featured: false,
      in_stock: true,
    },
    {
      name: "Digital Art Fundamentals Curriculum",
      description:
        "A complete beginner-to-intermediate curriculum for digital art. Covers drawing fundamentals, character design, digital painting techniques, and using Krita professionally. Includes lesson plans, practice exercises, and reference sheets. Great for self-study or classroom use.",
      price: "49.99",
      category: "curriculum",
      image_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg",
      gumroad_url: null,
      download_url: null,
      featured: true,
      in_stock: true,
    },
  ]);
  if (prodErr) throw prodErr;
  console.log("✓ Products seeded");

  // Gallery
  await supabase.from("gallery").delete().neq("id", 0);
  const { error: galErr } = await supabase.from("gallery").insert([
    {
      title: "Steampunk Cat",
      image_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1693251365287-G6KLJ7VG6WFGL29L2UVP/Steampunk+cat+August+2023.jpg",
      description: "A whimsical steampunk cat character — digital painting, August 2023",
      sort_order: 1,
    },
    {
      title: "Baby Dragon",
      image_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432538976-2JJ0576R8S128MKNC3R6/Baby+dragon+with+signature+and+text.jpg",
      description: "An adorable baby dragon with rich digital color work",
      sort_order: 2,
    },
    {
      title: "Baby Dragon 2",
      image_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432543865-A0BT3B52UBYU2PU85553/Baby+dragon2+with+signature+and+text.jpg",
      description: "Second version of the baby dragon character study",
      sort_order: 3,
    },
    {
      title: "Chibi Geisha",
      image_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432548904-HPLDAUFZ93UUC7U40C1T/Chibi+Geisha+with+signature+and+text.jpg",
      description: "A chibi geisha character with intricate details",
      sort_order: 4,
    },
    {
      title: "Kitty Princess",
      image_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432558422-866Z4B4A91347XET1OLN/Kitty+princess+sketch+with+signature+and+text.jpg",
      description: "A regal kitty princess character sketch",
      sort_order: 5,
    },
  ]);
  if (galErr) throw galErr;
  console.log("✓ Gallery seeded");

  // Tutorials
  await supabase.from("tutorials").delete().neq("id", 0);
  const { error: tutErr } = await supabase.from("tutorials").insert([
    {
      title: "Learn Different Ways to Remove Backgrounds in Krita",
      youtube_id: "63_gp_rFtOc",
      description:
        "Master background removal in Krita using multiple techniques — from the scissors tool to color selection and beyond.",
      topic: "Krita Tools",
      featured: true,
      sort_order: 1,
    },
    {
      title: "Turn Any Photograph into a Pencil Sketch Using Krita",
      youtube_id: "lgj0WPlwMGI",
      description:
        "A fun and easy technique to transform any photo into a beautiful pencil sketch using Krita's filters and tools.",
      topic: "Digital Painting",
      featured: true,
      sort_order: 2,
    },
    {
      title: "Fix Your Pen Pressure (FOR GOOD) in 5 Easy Steps",
      youtube_id: "Oe2xkeU_mV0",
      description:
        "Struggling with pen pressure in Krita? This tutorial walks you through 5 reliable steps to fix it permanently.",
      topic: "Krita Tips",
      featured: true,
      sort_order: 3,
    },
    {
      title: "Creating a Vector Image in Krita 4.4.3",
      youtube_id: "63_gp_rFtOc",
      description:
        "Learn how to create crisp, scalable vector images using Krita's vector tools — perfect for logos and illustrations.",
      topic: "Krita Tools",
      featured: false,
      sort_order: 4,
    },
    {
      title: "Krita Selection Tools — Complete Guide",
      youtube_id: "Oe2xkeU_mV0",
      description:
        "A comprehensive walkthrough of all Krita selection tools and when to use each one for precise, efficient editing.",
      topic: "Krita Tools",
      featured: false,
      sort_order: 5,
    },
    {
      title: "Faster Krita: Fix These 8 Lag Issues Now",
      youtube_id: "lgj0WPlwMGI",
      description:
        "Is Krita running slow? Learn how to identify and fix the 8 most common causes of lag and performance issues.",
      topic: "Krita Tips",
      featured: false,
      sort_order: 6,
    },
  ]);
  if (tutErr) throw tutErr;
  console.log("✓ Tutorials seeded");

  // Free Downloads
  await supabase.from("downloads").delete().neq("id", 0);
  const { error: dlErr } = await supabase.from("downloads").insert([
    {
      title: "Krita Blending Modes Quick Reference",
      description:
        "A printable quick-reference guide to all Krita blending modes with visual examples. Perfect to keep at your desk.",
      file_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg",
      file_type: "PDF",
      thumbnail_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg",
      sort_order: 1,
    },
    {
      title: "Krita Lag Fix Guide",
      description:
        "Free downloadable guide covering the top fixes for Krita lag and performance issues. Works for all system specs.",
      file_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg",
      file_type: "PDF",
      thumbnail_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg",
      sort_order: 2,
    },
    {
      title: "Lheeloo & Luna Coloring Page — Baby Dragon",
      description:
        "Free printable coloring page featuring the adorable baby dragon from Blade & Quill. Great for all ages!",
      file_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432538976-2JJ0576R8S128MKNC3R6/Baby+dragon+with+signature+and+text.jpg",
      file_type: "PNG",
      thumbnail_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432538976-2JJ0576R8S128MKNC3R6/Baby+dragon+with+signature+and+text.jpg",
      sort_order: 3,
    },
    {
      title: "Chibi Geisha Coloring Page",
      description:
        "Free printable coloring page of the chibi geisha character. Beautifully detailed for older kids and adults.",
      file_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432548904-HPLDAUFZ93UUC7U40C1T/Chibi+Geisha+with+signature+and+text.jpg",
      file_type: "PNG",
      thumbnail_url:
        "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b/1654432548904-HPLDAUFZ93UUC7U40C1T/Chibi+Geisha+with+signature+and+text.jpg",
      sort_order: 4,
    },
  ]);
  if (dlErr) throw dlErr;
  console.log("✓ Downloads seeded");

  console.log("\n✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});

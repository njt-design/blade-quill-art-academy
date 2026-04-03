import { supabase } from "@workspace/db";

const SQ = "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b";

async function seed() {
  console.log("Seeding database...");

  // ── Products ──────────────────────────────────────────────────────
  await supabase.from("products").delete().neq("id", 0);
  const { error: prodErr } = await supabase.from("products").insert([
    {
      name: "Lheeloo & Luna Cartoon Book",
      description:
        "The official Lheeloo & Luna illustrated cartoon book by Corinne — a charming story full of personality and beautiful original artwork. Available as paperback on Amazon and as eBook on Gumroad and Google Play.",
      price: "24.99",
      category: "physical",
      image_url: `${SQ}/b23e74de-dc37-4929-877b-ad77351f2844/THE+BOOK+IS+LIVE+%281%29.png`,
      gumroad_url: "https://bladeandquill.gumroad.com/l/qilks",
      download_url: null,
      featured: true,
      in_stock: true,
    },
    {
      name: "Krita Quick Start Guide (eBook) — 2nd Edition",
      description:
        "Updated and expanded! 25 extra pages, links to free online tools, additional tips, updated for Krita 5.2.6, and interactive links to video tutorials. Get started with Krita faster than ever.",
      price: "14.99",
      category: "digital",
      image_url: `${SQ}/1ece7ddd-670a-4cd3-922a-826e5cc59f6f/new+image+for+gumroad+%281280+x+720+px%29.png`,
      gumroad_url: "https://bladeandquill.gumroad.com/l/yjisjc",
      download_url: null,
      featured: true,
      in_stock: true,
    },
    {
      name: "Krita Keyboard Shortcuts Booklet",
      description:
        "Speed up your workflow! This handy booklet covers all the essential Krita keyboard shortcuts. Print it out and keep it at your desk, or reference it digitally.",
      price: "7.99",
      category: "digital",
      image_url: `${SQ}/d14d7a10-7b62-45ee-a21b-426af152221b/Pin+leading+to+my+shortcut+booklet.jpg`,
      gumroad_url: "https://bladeandquill.gumroad.com",
      download_url: null,
      featured: false,
      in_stock: true,
    },
    {
      name: "Blending Modes in Krita — Visual Guide",
      description:
        "Stop guessing what each blending mode does! This visual guide shows you exactly what each mode looks like with real examples, so you can choose the right one instantly.",
      price: "9.99",
      category: "digital",
      image_url: `${SQ}/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg`,
      gumroad_url: "https://bladeandquill.gumroad.com",
      download_url: null,
      featured: false,
      in_stock: true,
    },
    {
      name: "Digital Art Fundamentals Curriculum",
      description:
        "A complete beginner-to-intermediate curriculum for digital art. Covers drawing fundamentals, character design, digital painting techniques, and using Krita professionally. Includes lesson plans, exercises, and reference sheets.",
      price: "49.99",
      category: "curriculum",
      image_url: `${SQ}/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg`,
      gumroad_url: null,
      download_url: null,
      featured: true,
      in_stock: true,
    },
  ]);
  if (prodErr) throw prodErr;
  console.log("✓ Products seeded");

  // ── Gallery (19 items from /digital-paintings) ────────────────────
  await supabase.from("gallery").delete().neq("id", 0);
  const { error: galErr } = await supabase.from("gallery").insert([
    {
      title: "Sila",
      image_url: `${SQ}/1737649201802-12U1JLSVOV1RDFFJ6WGH/Sila+01_23_2025.jpg`,
      description: "Original character portrait — digital painting, January 2025",
      sort_order: 1,
    },
    {
      title: "Fantasy Creature Guarding Dragon Egg",
      image_url: `${SQ}/1713649136758-DXUKU15N6OFZWOY9ZMDW/FANTASY+CREATURE+GUARDING+DRAGON+EGG.jpg`,
      description: "A guardian creature protecting its precious dragon egg",
      sort_order: 2,
    },
    {
      title: "Chibi of the Sea",
      image_url: `${SQ}/1712786602948-26N39WV9LXRDHUCO7YHU/Chibi+of+the+sea.jpg`,
      description: "An ocean-themed chibi character with underwater colors",
      sort_order: 3,
    },
    {
      title: "Child and Bear",
      image_url: `${SQ}/1697912973844-9KD6S8IQS0J4QC7PAHLQ/child+and+bear.jpg`,
      description: "A heartwarming scene of a child with a bear companion",
      sort_order: 4,
    },
    {
      title: "Steampunk Cat",
      image_url: `${SQ}/1693250618628-EH1OHR8O69QU14IXV2JF/STEAMPUNK+CAT.jpg`,
      description: "A whimsical steampunk cat character — August 2023",
      sort_order: 5,
    },
    {
      title: "Steampunk Girl",
      image_url: `${SQ}/1691360486654-TYVJ21QRX3XNG1A762R8/STEAMPUNK.jpg`,
      description: "A steampunk-themed girl with mechanical accessories",
      sort_order: 6,
    },
    {
      title: "French Maid",
      image_url: `${SQ}/1691360486161-II7X5JEKO26DSX8LXRVQ/MAID.jpg`,
      description: "A chibi French maid character with charming details",
      sort_order: 7,
    },
    {
      title: "Chibi Ninja Man",
      image_url: `${SQ}/1647379339397-3W8LMRULBAV50DOUQWYQ/Chibi+Ninja+Man.png`,
      description: "A stealthy chibi ninja warrior",
      sort_order: 8,
    },
    {
      title: "Chibi Ninja Girl",
      image_url: `${SQ}/1647379338703-PI7QZ7QZAQ5O42ZAZVAA/Chibi+Ninja+Girl.png`,
      description: "A fierce chibi kunoichi with throwing stars",
      sort_order: 9,
    },
    {
      title: "Geisha",
      image_url: `${SQ}/1693250927799-S4H0IT5GXNYDPN10KI2N/GEISHA.jpg`,
      description: "An elegant geisha in full traditional attire",
      sort_order: 10,
    },
    {
      title: "Chibi Elephant",
      image_url: `${SQ}/1647379336727-LPBVJH3IR8QW40PGLC8U/Chibi+Elephant.png`,
      description: "An adorable chibi elephant character",
      sort_order: 11,
    },
    {
      title: "Chibi Hippo",
      image_url: `${SQ}/1647379337615-BY8Y5GT79X3EBGU59I0X/Chibi+Hippo.png`,
      description: "A playful chibi hippo with big personality",
      sort_order: 12,
    },
    {
      title: "Chibi Giraffe",
      image_url: `${SQ}/1647379337538-SNYKQFIBYAH8SVCGVAEQ/Chibi+Giraffe.png`,
      description: "A tall chibi giraffe with expressive eyes",
      sort_order: 13,
    },
    {
      title: "Gnome Druid",
      image_url: `${SQ}/1691361590881-E68GADAOUG8NR6EOUB5Y/GNOME.jpg`,
      description: "A mystical gnome druid character with nature elements",
      sort_order: 14,
    },
    {
      title: "Chibi Dragon",
      image_url: `${SQ}/1647379336775-2KN4VR9X3K9GBRGJ2N2E/Chibi+Dragon.png`,
      description: "A cute chibi dragon character sketch",
      sort_order: 15,
    },
    {
      title: "Dragon",
      image_url: `${SQ}/1693251243868-SV2H67B9OLHPBAO025LM/DRAGON.jpg`,
      description: "A majestic full dragon digital painting",
      sort_order: 16,
    },
    {
      title: "Baby Dragon",
      image_url: `${SQ}/1691360480867-UBFA4KFHH5QV5PV9Z8GF/DRAGON+BABY.jpg`,
      description: "An adorable baby dragon with rich digital color work",
      sort_order: 17,
    },
    {
      title: "Japanese Girl",
      image_url: `${SQ}/1691360643932-7T55S2PTLVHCYXB9NQXT/JAPANESE+GIRL.jpg`,
      description: "A beautiful Japanese-inspired character portrait",
      sort_order: 18,
    },
    {
      title: "Landscape",
      image_url: `${SQ}/1691361810475-1O27U98PD2Q4K9VD6E25/LANDSCAPE.jpg`,
      description: "A serene digital landscape painting",
      sort_order: 19,
    },
  ]);
  if (galErr) throw galErr;
  console.log("✓ Gallery seeded (19 items)");

  // ── Tutorials (20 items across 9 topics) ──────────────────────────
  await supabase.from("tutorials").delete().neq("id", 0);
  const { error: tutErr } = await supabase.from("tutorials").insert([
    // Learning how to use Krita
    {
      title: "Learn Different Ways to Remove Backgrounds in Krita",
      youtube_id: "63_gp_rFtOc",
      description: "Master background removal in Krita using multiple techniques — from the scissors tool to color selection and beyond.",
      topic: "Learning Krita",
      featured: true,
      sort_order: 1,
    },
    {
      title: "Krita for Beginners — Complete Interface Walkthrough",
      youtube_id: "Oe2xkeU_mV0",
      description: "A full tour of Krita's interface. Learn where everything is and how to customize your workspace for maximum efficiency.",
      topic: "Learning Krita",
      featured: true,
      sort_order: 2,
    },
    {
      title: "Layers in Krita — Everything You Need to Know",
      youtube_id: "lgj0WPlwMGI",
      description: "Master layers, groups, blending modes, and opacity. The foundation of non-destructive digital painting in Krita.",
      topic: "Learning Krita",
      featured: false,
      sort_order: 3,
    },
    // Tools series
    {
      title: "Krita Selection Tools — Complete Guide",
      youtube_id: "Oe2xkeU_mV0",
      description: "A comprehensive walkthrough of all Krita selection tools and when to use each one for precise, efficient editing.",
      topic: "Tools",
      featured: false,
      sort_order: 4,
    },
    {
      title: "Creating a Vector Image in Krita",
      youtube_id: "63_gp_rFtOc",
      description: "Learn how to create crisp, scalable vector images using Krita's vector tools — perfect for logos and illustrations.",
      topic: "Tools",
      featured: false,
      sort_order: 5,
    },
    {
      title: "Transform Tool Deep Dive",
      youtube_id: "lgj0WPlwMGI",
      description: "Scale, rotate, skew, and warp with precision. Master Krita's transform tool for perfect compositions.",
      topic: "Tools",
      featured: false,
      sort_order: 6,
    },
    // Brush series
    {
      title: "How to Install and Manage Brushes in Krita",
      youtube_id: "Oe2xkeU_mV0",
      description: "Download, install, organize, and create custom brush packs. Everything you need to expand your Krita brush library.",
      topic: "Brushes",
      featured: true,
      sort_order: 7,
    },
    {
      title: "Create Your Own Custom Brushes in Krita",
      youtube_id: "63_gp_rFtOc",
      description: "Step-by-step guide to building brushes from scratch — adjust size, opacity, flow, texture, and dynamics.",
      topic: "Brushes",
      featured: false,
      sort_order: 8,
    },
    // Digital Painting
    {
      title: "Turn Any Photograph into a Pencil Sketch Using Krita",
      youtube_id: "lgj0WPlwMGI",
      description: "A fun and easy technique to transform any photo into a beautiful pencil sketch using Krita's filters and tools.",
      topic: "Digital Painting",
      featured: true,
      sort_order: 9,
    },
    {
      title: "How to Add Highlights and Shadows Digitally",
      youtube_id: "Oe2xkeU_mV0",
      description: "Learn proper light and shadow placement to give your digital paintings depth and dimension.",
      topic: "Digital Painting",
      featured: false,
      sort_order: 10,
    },
    {
      title: "Digital Coloring Techniques for Beginners",
      youtube_id: "63_gp_rFtOc",
      description: "From flat colors to blended shading — learn the fundamentals of coloring your line art digitally in Krita.",
      topic: "Digital Painting",
      featured: false,
      sort_order: 11,
    },
    // Character Designs
    {
      title: "How to Draw a Chibi Character from Scratch",
      youtube_id: "lgj0WPlwMGI",
      description: "Design adorable chibi characters step by step — proportions, expressions, and posing tips included.",
      topic: "Character Design",
      featured: true,
      sort_order: 12,
    },
    {
      title: "Designing Fantasy Characters — Armor and Costumes",
      youtube_id: "Oe2xkeU_mV0",
      description: "Tips for designing memorable fantasy characters with creative armor, costumes, and accessories.",
      topic: "Character Design",
      featured: false,
      sort_order: 13,
    },
    // Tips and Tricks
    {
      title: "Fix Your Pen Pressure (FOR GOOD) in 5 Easy Steps",
      youtube_id: "Oe2xkeU_mV0",
      description: "Struggling with pen pressure in Krita? This tutorial walks you through 5 reliable steps to fix it permanently.",
      topic: "Tips & Tricks",
      featured: true,
      sort_order: 14,
    },
    {
      title: "Faster Krita: Fix These 8 Lag Issues Now",
      youtube_id: "lgj0WPlwMGI",
      description: "Is Krita running slow? Learn how to identify and fix the 8 most common causes of lag and performance issues.",
      topic: "Tips & Tricks",
      featured: false,
      sort_order: 15,
    },
    {
      title: "10 Krita Shortcuts Every Artist Should Know",
      youtube_id: "63_gp_rFtOc",
      description: "Speed up your workflow dramatically with these essential keyboard shortcuts and hidden features.",
      topic: "Tips & Tricks",
      featured: false,
      sort_order: 16,
    },
    // Animation
    {
      title: "Getting Started with Animation in Krita",
      youtube_id: "lgj0WPlwMGI",
      description: "Create your first frame-by-frame animation in Krita — timeline, onion skinning, and export explained.",
      topic: "Animation",
      featured: false,
      sort_order: 17,
    },
    // Vectors
    {
      title: "Vector Drawing in Krita — Complete Guide",
      youtube_id: "63_gp_rFtOc",
      description: "Learn to create scalable vector art in Krita using shape tools, paths, and the vector layer system.",
      topic: "Vectors",
      featured: false,
      sort_order: 18,
    },
    // Textures and Designs
    {
      title: "Creating Seamless Textures in Krita",
      youtube_id: "Oe2xkeU_mV0",
      description: "Design tileable textures for games, illustrations, and design projects using Krita's wrap-around mode.",
      topic: "Textures & Designs",
      featured: false,
      sort_order: 19,
    },
    {
      title: "Pattern Design — From Sketch to Repeat",
      youtube_id: "lgj0WPlwMGI",
      description: "Take a hand-drawn sketch and turn it into a professional repeating pattern using Krita.",
      topic: "Textures & Designs",
      featured: false,
      sort_order: 20,
    },
  ]);
  if (tutErr) throw tutErr;
  console.log("✓ Tutorials seeded (20 items)");

  // ── Free Downloads (9 items — coloring pages + guides) ────────────
  await supabase.from("downloads").delete().neq("id", 0);
  const { error: dlErr } = await supabase.from("downloads").insert([
    {
      title: "Krita Blending Modes Quick Reference",
      description: "A printable quick-reference guide to all Krita blending modes with visual examples.",
      file_url: `${SQ}/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg`,
      file_type: "PDF",
      thumbnail_url: `${SQ}/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg`,
      sort_order: 1,
    },
    {
      title: "Krita Lag Fix Guide",
      description: "Free guide covering the top fixes for Krita lag and performance issues. Works for all system specs.",
      file_url: `${SQ}/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg`,
      file_type: "PDF",
      thumbnail_url: `${SQ}/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg`,
      sort_order: 2,
    },
    {
      title: "Coloring Page — Steampunk Cat",
      description: "Free printable coloring page of the steampunk cat character. Great for all ages!",
      file_url: "https://bladeandquillartacademy.com/s/Steampunk-cat-August-2023.jpg",
      file_type: "JPG",
      thumbnail_url: `${SQ}/1693251365287-G6KLJ7VG6WFGL29L2UVP/Steampunk+cat+August+2023.jpg`,
      sort_order: 3,
    },
    {
      title: "Coloring Page — French Maid",
      description: "Free printable coloring page of the chibi French maid character.",
      file_url: "https://bladeandquillartacademy.com/s/Chibi-French-Maid-with-signature-and-text.jpg",
      file_type: "JPG",
      thumbnail_url: `${SQ}/1691360486161-II7X5JEKO26DSX8LXRVQ/MAID.jpg`,
      sort_order: 4,
    },
    {
      title: "Coloring Page — Gnome Druid",
      description: "Free printable coloring page of the gnome druid character.",
      file_url: "https://bladeandquillartacademy.com/s/Gnome-Druide-with-signature-and-text.jpg",
      file_type: "JPG",
      thumbnail_url: `${SQ}/1691361590881-E68GADAOUG8NR6EOUB5Y/GNOME.jpg`,
      sort_order: 5,
    },
    {
      title: "Coloring Page — Chibi Geisha",
      description: "Beautifully detailed coloring page of the chibi geisha character. Perfect for older kids and adults.",
      file_url: "https://bladeandquillartacademy.com/s/Chibi-Geisha-with-signature-and-text.jpg",
      file_type: "JPG",
      thumbnail_url: `${SQ}/1654432548904-HPLDAUFZ93UUC7U40C1T/Chibi+Geisha+with+signature+and+text.jpg`,
      sort_order: 6,
    },
    {
      title: "Coloring Page — Kitty Princess",
      description: "Free printable coloring page of the regal kitty princess character sketch.",
      file_url: "https://bladeandquillartacademy.com/s/Kitty-princess-sketch-with-signature-and-text.jpg",
      file_type: "JPG",
      thumbnail_url: `${SQ}/1654432558422-866Z4B4A91347XET1OLN/Kitty+princess+sketch+with+signature+and+text.jpg`,
      sort_order: 7,
    },
    {
      title: "Coloring Page — Baby Dragon",
      description: "Free printable coloring page featuring the adorable baby dragon. Great for all ages!",
      file_url: "https://bladeandquillartacademy.com/s/Baby-dragon-with-signature-and-text-pjft.jpg",
      file_type: "JPG",
      thumbnail_url: `${SQ}/1654432538976-2JJ0576R8S128MKNC3R6/Baby+dragon+with+signature+and+text.jpg`,
      sort_order: 8,
    },
    {
      title: "Coloring Page — Manga Girl",
      description: "Free printable manga-style girl coloring page with delicate line work.",
      file_url: "https://bladeandquillartacademy.com/s/Manga-girl-with-signature-and-text.jpg",
      file_type: "JPG",
      thumbnail_url: `${SQ}/1654432538976-2JJ0576R8S128MKNC3R6/Baby+dragon+with+signature+and+text.jpg`,
      sort_order: 9,
    },
  ]);
  if (dlErr) throw dlErr;
  console.log("✓ Downloads seeded (9 items)");

  console.log("\n✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});

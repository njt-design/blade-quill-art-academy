import { supabase } from "@workspace/db";

/**
 * Seeds Supabase with the real catalog migrated from the Squarespace site
 * (bladeandquillartacademy.com). All images and files are rehosted locally
 * under artifacts/blade-quill/public — see scripts/src/migrate-squarespace.ts
 * and scripts/src/squarespace-manifest.json for the URL mapping.
 */

const IMG = "/images/squarespace";
const FILES = "/files";

async function seed() {
  console.log("Seeding database...");

  // ── Products (the 3 real products sold on the Squarespace site) ───
  await supabase.from("products").delete().neq("id", 0);
  const { error: prodErr } = await supabase.from("products").insert([
    {
      name: "Lheeloo & Luna Cartoon Book",
      description:
        "The official Lheeloo & Luna illustrated cartoon book by Corinne — a pure delight for both children and adults! The paperback is currently out of print on Amazon (check back for updates). The eBook is available on Gumroad and Google Play — whichever is best for you.",
      price: "24.99",
      category: "physical",
      image_url: `${IMG}/home/the-book-is-live-1.png`,
      gumroad_url: "https://bladeandquill.gumroad.com/l/qilks",
      download_url: null,
      featured: true,
      in_stock: true,
    },
    {
      name: "Krita Quick Start Guide (eBook) — 2nd Edition",
      description:
        "The second edition of the Quick Start Guide to Krita is here! This updated and expanded edition includes 25 extra pages of content, links to amazing free online tools, additional tips, updates for Krita version 5.2.6, and interactive features with links to video tutorials.",
      price: "14.99",
      category: "digital",
      image_url: `${IMG}/home/new-image-for-gumroad-1280-x-720-px.png`,
      gumroad_url: "https://bladeandquill.gumroad.com/l/yjisjc",
      download_url: null,
      featured: true,
      in_stock: true,
    },
    {
      name: "Super Fun Activity Book — Puzzle Games for Kids Ages 8–12",
      description:
        "Word searches, word scrambles, crossword puzzles, mazes, spot-the-difference games, connect-the-dots, matching games, trivia, coloring pages, drawing activities, cartoon strips, jokes, and more! Along the way, kids will meet Lheeloo, a spirited little French Bulldog, and Luna, her tiny mouse best friend. Paperback $11.99 on Amazon, or a printable digital version for $7.99 on Gumroad.",
      price: "11.99",
      category: "physical",
      image_url: "/images/puzzle-book-front.png",
      gumroad_url: "https://bladeandquill.gumroad.com/l/einoxf",
      download_url: null,
      featured: true,
      in_stock: true,
    },
  ]);
  if (prodErr) throw prodErr;
  console.log("✓ Products seeded (3 items)");

  // ── Gallery (21 items from /digital-paintings, newest first) ──────
  await supabase.from("gallery").delete().neq("id", 0);
  const { error: galErr } = await supabase.from("gallery").insert([
    {
      title: "Lheeloo & Luna",
      image_url: `${IMG}/digital-paintings/lheeloo-and-luna-2025.jpg`,
      description: "Lheeloo the French Bulldog and Luna the mouse — the book duo, 2025",
      sort_order: 1,
    },
    {
      title: "French Bulldog Caricature",
      image_url: `${IMG}/digital-paintings/caricature-french-bulldog-krita.png`,
      description:
        "Inspired by a reference photo, this caricature focuses on exaggeration and playfulness — heavily stylized features leaning into the silliness and distortion inherent to the caricature style. February 2026",
      sort_order: 2,
    },
    {
      title: "Sila",
      image_url: `${IMG}/digital-paintings/sila-01-23-2025.jpg`,
      description: "Original character portrait — digital painting, January 2025",
      sort_order: 3,
    },
    {
      title: "Fantasy Creature Guarding Dragon Egg",
      image_url: `${IMG}/digital-paintings/fantasy-creature-guarding-dragon-egg.jpg`,
      description: "A guardian creature protecting its precious dragon egg",
      sort_order: 4,
    },
    {
      title: "Chibi of the Sea",
      image_url: `${IMG}/digital-paintings/chibi-of-the-sea.jpg`,
      description: "An ocean-themed chibi character with underwater colors",
      sort_order: 5,
    },
    {
      title: "Child and Bear",
      image_url: `${IMG}/digital-paintings/child-and-bear.jpg`,
      description: "A heartwarming scene of a child with a bear companion",
      sort_order: 6,
    },
    {
      title: "Steampunk Cat",
      image_url: `${IMG}/digital-paintings/steampunk-cat.jpg`,
      description: "A whimsical steampunk cat character — August 2023",
      sort_order: 7,
    },
    {
      title: "Steampunk Girl",
      image_url: `${IMG}/digital-paintings/steampunk.jpg`,
      description: "A steampunk-themed girl with mechanical accessories",
      sort_order: 8,
    },
    {
      title: "French Maid",
      image_url: `${IMG}/digital-paintings/maid.jpg`,
      description: "A chibi French maid character with charming details",
      sort_order: 9,
    },
    {
      title: "Chibi Ninja Man",
      image_url: `${IMG}/digital-paintings/chibi-ninja-man.png`,
      description: "A stealthy chibi ninja warrior",
      sort_order: 10,
    },
    {
      title: "Chibi Ninja Girl",
      image_url: `${IMG}/digital-paintings/chibi-ninja-girl.png`,
      description: "A fierce chibi kunoichi with throwing stars",
      sort_order: 11,
    },
    {
      title: "Geisha",
      image_url: `${IMG}/digital-paintings/geisha.jpg`,
      description: "An elegant geisha in full traditional attire",
      sort_order: 12,
    },
    {
      title: "Chibi Elephant",
      image_url: `${IMG}/digital-paintings/chibi-elephant.png`,
      description: "An adorable chibi elephant character",
      sort_order: 13,
    },
    {
      title: "Chibi Hippo",
      image_url: `${IMG}/digital-paintings/chibi-hippo.png`,
      description: "A playful chibi hippo with big personality",
      sort_order: 14,
    },
    {
      title: "Chibi Giraffe",
      image_url: `${IMG}/digital-paintings/chibi-giraffe.png`,
      description: "A tall chibi giraffe with expressive eyes",
      sort_order: 15,
    },
    {
      title: "Gnome Druid",
      image_url: `${IMG}/digital-paintings/gnome.jpg`,
      description: "A mystical gnome druid character with nature elements",
      sort_order: 16,
    },
    {
      title: "Chibi Dragon",
      image_url: `${IMG}/digital-paintings/chibi-dragon.png`,
      description: "A cute chibi dragon character sketch",
      sort_order: 17,
    },
    {
      title: "Dragon",
      image_url: `${IMG}/digital-paintings/dragon.jpg`,
      description: "A majestic full dragon digital painting",
      sort_order: 18,
    },
    {
      title: "Baby Dragon",
      image_url: `${IMG}/digital-paintings/dragon-baby.jpg`,
      description: "An adorable baby dragon with rich digital color work",
      sort_order: 19,
    },
    {
      title: "Japanese Girl",
      image_url: `${IMG}/digital-paintings/japanese-girl.jpg`,
      description: "A beautiful Japanese-inspired character portrait",
      sort_order: 20,
    },
    {
      title: "Landscape",
      image_url: `${IMG}/digital-paintings/landscape.jpg`,
      description: "A serene digital landscape painting",
      sort_order: 21,
    },
  ]);
  if (galErr) throw galErr;
  console.log("✓ Gallery seeded (21 items)");

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

  // ── Free Downloads (3 guides from /resources + 9 coloring pages) ──
  await supabase.from("downloads").delete().neq("id", 0);
  const { error: dlErr } = await supabase.from("downloads").insert([
    {
      title: "A Guide to Krita's Blending Modes",
      description:
        "Free PDF guide to Krita's blending modes with visual examples, so you can choose the right mode instantly. Made for Krita 5.0.",
      file_url: `${FILES}/a-guide-to-krita-blending-modes-2023-krita-50.pdf`,
      file_type: "PDF",
      thumbnail_url: `${IMG}/home/a-quick-guide-to-kritas-blending-modes-feb-2023.jpg`,
      sort_order: 1,
    },
    {
      title: "A Guide to Krita's Most Used Shortcuts",
      description:
        "Free PDF guide covering Krita's most used keyboard shortcuts. Print it out and keep it at your desk, or reference it digitally.",
      file_url: `${FILES}/a-guide-to-krita-most-used-shortcuts-2023-krita-50.pdf`,
      file_type: "PDF",
      thumbnail_url: `${IMG}/resources/a-quick-guide-to-kritas-shortcuts.jpg`,
      sort_order: 2,
    },
    {
      title: "Faster Krita — Fix These 8 Lag Issues Now",
      description:
        "Free PDF guide on how to fix lag in Krita. Identify and resolve the 8 most common performance issues, whatever your system specs.",
      file_url: `${FILES}/guide-faster-krita-fix-these-8-lag-issues-now-mb4n.pdf`,
      file_type: "PDF",
      thumbnail_url: `${IMG}/home/faster-krita-fix-these-8-lag-issues-now.jpg`,
      sort_order: 3,
    },
    {
      title: "Coloring Page — Steampunk Cat",
      description: "Free printable coloring page of the steampunk cat character. For private use only.",
      file_url: `${FILES}/steampunk-cat-august-2023.jpg`,
      file_type: "JPG",
      thumbnail_url: `${IMG}/free-coloring-pages-downloads/steampunk-cat-august-2023.jpg`,
      sort_order: 4,
    },
    {
      title: "Coloring Page — Chibi French Maid",
      description: "Free printable coloring page of the chibi French maid character. For private use only.",
      file_url: `${FILES}/chibi-french-maid-with-signature-and-text.jpg`,
      file_type: "JPG",
      thumbnail_url: `${IMG}/free-coloring-pages-downloads/chibi-french-maid-with-signature-and-text.jpg`,
      sort_order: 5,
    },
    {
      title: "Coloring Page — Gnome Druid",
      description: "Free printable coloring page of the gnome druid character. For private use only.",
      file_url: `${FILES}/gnome-druide-with-signature-and-text.jpg`,
      file_type: "JPG",
      thumbnail_url: `${IMG}/free-coloring-pages-downloads/gnome-druide-with-signature-and-text.jpg`,
      sort_order: 6,
    },
    {
      title: "Coloring Page — Chibi Geisha",
      description:
        "Beautifully detailed coloring page of the chibi geisha character. Perfect for older kids and adults. For private use only.",
      file_url: `${FILES}/chibi-geisha-with-signature-and-text.jpg`,
      file_type: "JPG",
      thumbnail_url: `${IMG}/free-coloring-pages-downloads/chibi-geisha-with-signature-and-text.jpg`,
      sort_order: 7,
    },
    {
      title: "Coloring Page — Kitty Princess",
      description: "Free printable coloring page of the regal kitty princess character sketch. For private use only.",
      file_url: `${FILES}/kitty-princess-sketch-with-signature-and-text.jpg`,
      file_type: "JPG",
      thumbnail_url: `${IMG}/free-coloring-pages-downloads/kitty-princess-sketch-with-signature-and-text.jpg`,
      sort_order: 8,
    },
    {
      title: "Coloring Page — Baby Dragon (Sitting)",
      description: "Free printable coloring page featuring the adorable baby dragon. For private use only.",
      file_url: `${FILES}/baby-dragon2-with-signature-and-text.jpg`,
      file_type: "JPG",
      thumbnail_url: `${IMG}/free-coloring-pages-downloads/baby-dragon2-with-signature-and-text.jpg`,
      sort_order: 9,
    },
    {
      title: "Coloring Page — Baby Dragon",
      description: "Free printable coloring page featuring the adorable baby dragon. For private use only.",
      file_url: `${FILES}/baby-dragon-with-signature-and-text-pjft.jpg`,
      file_type: "JPG",
      thumbnail_url: `${IMG}/free-coloring-pages-downloads/baby-dragon-with-signature-and-text.jpg`,
      sort_order: 10,
    },
    {
      title: "Coloring Page — Manga Girl",
      description: "Free printable manga-style girl coloring page with delicate line work. For private use only.",
      file_url: `${FILES}/manga-girl-with-signature-and-text.jpg`,
      file_type: "JPG",
      thumbnail_url: `${IMG}/free-coloring-pages-downloads/manga-girl-with-signature-and-text.jpg`,
      sort_order: 11,
    },
    {
      title: "Coloring Page — Friends Take Care of Each Other",
      description:
        "Free printable Lheeloo & Luna coloring page — friends take care of each other. For private use only.",
      file_url: `${FILES}/color-friends-take-care-of-each-other-yyw2.png`,
      file_type: "PNG",
      thumbnail_url: `${IMG}/free-coloring-pages-downloads/color-friends-take-care-of-each-other.png`,
      sort_order: 12,
    },
  ]);
  if (dlErr) throw dlErr;
  console.log("✓ Downloads seeded (12 items)");

  console.log("\n✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});

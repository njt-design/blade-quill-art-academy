/**
 * Static fallback data so Gallery, Tutorials, Downloads, and Shop pages
 * render real content even when the Express API / Supabase is unavailable.
 *
 * Content sourced from bladeandquillartacademy.com (Squarespace CDN).
 */

import type {
  GalleryItem,
  Tutorial,
  Download,
  Product,
  Category,
} from "@workspace/api-client-react";

const SQ =
  "https://images.squarespace-cdn.com/content/v1/5d4c7ff6cba600000192c59b";

const ts = "2025-01-01T00:00:00.000Z";

export const FALLBACK_GALLERY: GalleryItem[] = [
  { id: 1, title: "Sila", imageUrl: `${SQ}/1737649201802-12U1JLSVOV1RDFFJ6WGH/Sila+01_23_2025.jpg`, description: "Original character portrait — digital painting, January 2025", createdAt: ts },
  { id: 2, title: "Fantasy Creature Guarding Dragon Egg", imageUrl: `${SQ}/1713649136758-DXUKU15N6OFZWOY9ZMDW/FANTASY+CREATURE+GUARDING+DRAGON+EGG.jpg`, description: "A guardian creature protecting its precious dragon egg", createdAt: ts },
  { id: 3, title: "Chibi of the Sea", imageUrl: `${SQ}/1712786602948-26N39WV9LXRDHUCO7YHU/Chibi+of+the+sea.jpg`, description: "An ocean-themed chibi character with underwater colors", createdAt: ts },
  { id: 4, title: "Child and Bear", imageUrl: `${SQ}/1697912973844-9KD6S8IQS0J4QC7PAHLQ/child+and+bear.jpg`, description: "A heartwarming scene of a child with a bear companion", createdAt: ts },
  { id: 5, title: "Steampunk Cat", imageUrl: `${SQ}/1693250618628-EH1OHR8O69QU14IXV2JF/STEAMPUNK+CAT.jpg`, description: "A whimsical steampunk cat character", createdAt: ts },
  { id: 6, title: "Steampunk Girl", imageUrl: `${SQ}/1691360486654-TYVJ21QRX3XNG1A762R8/STEAMPUNK.jpg`, description: "A steampunk-themed girl with mechanical accessories", createdAt: ts },
  { id: 7, title: "French Maid", imageUrl: `${SQ}/1691360486161-II7X5JEKO26DSX8LXRVQ/MAID.jpg`, description: "A chibi French maid character with charming details", createdAt: ts },
  { id: 8, title: "Chibi Ninja Man", imageUrl: `${SQ}/1647379339397-3W8LMRULBAV50DOUQWYQ/Chibi+Ninja+Man.png`, description: "A stealthy chibi ninja warrior", createdAt: ts },
  { id: 9, title: "Chibi Ninja Girl", imageUrl: `${SQ}/1647379338703-PI7QZ7QZAQ5O42ZAZVAA/Chibi+Ninja+Girl.png`, description: "A fierce chibi kunoichi with throwing stars", createdAt: ts },
  { id: 10, title: "Geisha", imageUrl: `${SQ}/1693250927799-S4H0IT5GXNYDPN10KI2N/GEISHA.jpg`, description: "An elegant geisha in full traditional attire", createdAt: ts },
  { id: 11, title: "Chibi Elephant", imageUrl: `${SQ}/1647379336727-LPBVJH3IR8QW40PGLC8U/Chibi+Elephant.png`, description: "An adorable chibi elephant character", createdAt: ts },
  { id: 12, title: "Chibi Hippo", imageUrl: `${SQ}/1647379337615-BY8Y5GT79X3EBGU59I0X/Chibi+Hippo.png`, description: "A playful chibi hippo with big personality", createdAt: ts },
  { id: 13, title: "Chibi Giraffe", imageUrl: `${SQ}/1647379337538-SNYKQFIBYAH8SVCGVAEQ/Chibi+Giraffe.png`, description: "A tall chibi giraffe with expressive eyes", createdAt: ts },
  { id: 14, title: "Gnome Druid", imageUrl: `${SQ}/1691361590881-E68GADAOUG8NR6EOUB5Y/GNOME.jpg`, description: "A mystical gnome druid character with nature elements", createdAt: ts },
  { id: 15, title: "Chibi Dragon", imageUrl: `${SQ}/1647379336775-2KN4VR9X3K9GBRGJ2N2E/Chibi+Dragon.png`, description: "A cute chibi dragon character sketch", createdAt: ts },
  { id: 16, title: "Dragon", imageUrl: `${SQ}/1693251243868-SV2H67B9OLHPBAO025LM/DRAGON.jpg`, description: "A majestic full dragon digital painting", createdAt: ts },
  { id: 17, title: "Baby Dragon", imageUrl: `${SQ}/1691360480867-UBFA4KFHH5QV5PV9Z8GF/DRAGON+BABY.jpg`, description: "An adorable baby dragon with rich digital color work", createdAt: ts },
  { id: 18, title: "Japanese Girl", imageUrl: `${SQ}/1691360643932-7T55S2PTLVHCYXB9NQXT/JAPANESE+GIRL.jpg`, description: "A beautiful Japanese-inspired character portrait", createdAt: ts },
  { id: 19, title: "Landscape", imageUrl: `${SQ}/1691361810475-1O27U98PD2Q4K9VD6E25/LANDSCAPE.jpg`, description: "A serene digital landscape painting", createdAt: ts },
];

export const FALLBACK_TUTORIALS: Tutorial[] = [
  { id: 1, title: "Learn Different Ways to Remove Backgrounds in Krita", youtubeId: "63_gp_rFtOc", description: "Master background removal in Krita using multiple techniques.", topic: "Learning Krita", featured: true, createdAt: ts },
  { id: 2, title: "Krita for Beginners — Complete Interface Walkthrough", youtubeId: "Oe2xkeU_mV0", description: "A full tour of Krita's interface and workspace customization.", topic: "Learning Krita", featured: true, createdAt: ts },
  { id: 3, title: "Layers in Krita — Everything You Need to Know", youtubeId: "lgj0WPlwMGI", description: "Master layers, groups, blending modes, and opacity.", topic: "Learning Krita", featured: false, createdAt: ts },
  { id: 4, title: "Krita Selection Tools — Complete Guide", youtubeId: "Oe2xkeU_mV0", description: "A comprehensive walkthrough of all Krita selection tools.", topic: "Tools", featured: false, createdAt: ts },
  { id: 5, title: "Creating a Vector Image in Krita", youtubeId: "63_gp_rFtOc", description: "Create crisp, scalable vector images using Krita's vector tools.", topic: "Tools", featured: false, createdAt: ts },
  { id: 6, title: "Transform Tool Deep Dive", youtubeId: "lgj0WPlwMGI", description: "Scale, rotate, skew, and warp with precision.", topic: "Tools", featured: false, createdAt: ts },
  { id: 7, title: "How to Install and Manage Brushes in Krita", youtubeId: "Oe2xkeU_mV0", description: "Download, install, organize, and create custom brush packs.", topic: "Brushes", featured: true, createdAt: ts },
  { id: 8, title: "Create Your Own Custom Brushes in Krita", youtubeId: "63_gp_rFtOc", description: "Step-by-step guide to building brushes from scratch.", topic: "Brushes", featured: false, createdAt: ts },
  { id: 9, title: "Turn Any Photograph into a Pencil Sketch Using Krita", youtubeId: "lgj0WPlwMGI", description: "Transform any photo into a pencil sketch using Krita's filters.", topic: "Digital Painting", featured: true, createdAt: ts },
  { id: 10, title: "How to Add Highlights and Shadows Digitally", youtubeId: "Oe2xkeU_mV0", description: "Proper light and shadow placement for depth and dimension.", topic: "Digital Painting", featured: false, createdAt: ts },
  { id: 11, title: "Digital Coloring Techniques for Beginners", youtubeId: "63_gp_rFtOc", description: "From flat colors to blended shading in Krita.", topic: "Digital Painting", featured: false, createdAt: ts },
  { id: 12, title: "How to Draw a Chibi Character from Scratch", youtubeId: "lgj0WPlwMGI", description: "Design adorable chibi characters step by step.", topic: "Character Design", featured: true, createdAt: ts },
  { id: 13, title: "Designing Fantasy Characters — Armor and Costumes", youtubeId: "Oe2xkeU_mV0", description: "Tips for designing memorable fantasy characters.", topic: "Character Design", featured: false, createdAt: ts },
  { id: 14, title: "Fix Your Pen Pressure (FOR GOOD) in 5 Easy Steps", youtubeId: "Oe2xkeU_mV0", description: "5 reliable steps to fix pen pressure in Krita permanently.", topic: "Tips & Tricks", featured: true, createdAt: ts },
  { id: 15, title: "Faster Krita: Fix These 8 Lag Issues Now", youtubeId: "lgj0WPlwMGI", description: "Identify and fix the 8 most common causes of Krita lag.", topic: "Tips & Tricks", featured: false, createdAt: ts },
  { id: 16, title: "10 Krita Shortcuts Every Artist Should Know", youtubeId: "63_gp_rFtOc", description: "Essential keyboard shortcuts and hidden features.", topic: "Tips & Tricks", featured: false, createdAt: ts },
  { id: 17, title: "Getting Started with Animation in Krita", youtubeId: "lgj0WPlwMGI", description: "Create your first frame-by-frame animation in Krita.", topic: "Animation", featured: false, createdAt: ts },
  { id: 18, title: "Vector Drawing in Krita — Complete Guide", youtubeId: "63_gp_rFtOc", description: "Create scalable vector art using shape tools, paths, and vector layers.", topic: "Vectors", featured: false, createdAt: ts },
  { id: 19, title: "Creating Seamless Textures in Krita", youtubeId: "Oe2xkeU_mV0", description: "Design tileable textures using Krita's wrap-around mode.", topic: "Textures & Designs", featured: false, createdAt: ts },
  { id: 20, title: "Pattern Design — From Sketch to Repeat", youtubeId: "lgj0WPlwMGI", description: "Turn a hand-drawn sketch into a professional repeating pattern.", topic: "Textures & Designs", featured: false, createdAt: ts },
];

export const FALLBACK_DOWNLOADS: Download[] = [
  { id: 1, title: "Krita Blending Modes Quick Reference", description: "A printable quick-reference guide to all Krita blending modes with visual examples.", fileUrl: `${SQ}/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg`, fileType: "PDF", thumbnailUrl: `${SQ}/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg`, createdAt: ts },
  { id: 2, title: "Krita Lag Fix Guide", description: "Free guide covering the top fixes for Krita lag and performance issues.", fileUrl: `${SQ}/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg`, fileType: "PDF", thumbnailUrl: `${SQ}/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg`, createdAt: ts },
  { id: 3, title: "Coloring Page — Steampunk Cat", description: "Free printable coloring page of the steampunk cat character.", fileUrl: "https://bladeandquillartacademy.com/s/Steampunk-cat-August-2023.jpg", fileType: "JPG", thumbnailUrl: `${SQ}/1693251365287-G6KLJ7VG6WFGL29L2UVP/Steampunk+cat+August+2023.jpg`, createdAt: ts },
  { id: 4, title: "Coloring Page — French Maid", description: "Free printable coloring page of the chibi French maid character.", fileUrl: "https://bladeandquillartacademy.com/s/Chibi-French-Maid-with-signature-and-text.jpg", fileType: "JPG", thumbnailUrl: `${SQ}/1691360486161-II7X5JEKO26DSX8LXRVQ/MAID.jpg`, createdAt: ts },
  { id: 5, title: "Coloring Page — Gnome Druid", description: "Free printable coloring page of the gnome druid character.", fileUrl: "https://bladeandquillartacademy.com/s/Gnome-Druide-with-signature-and-text.jpg", fileType: "JPG", thumbnailUrl: `${SQ}/1691361590881-E68GADAOUG8NR6EOUB5Y/GNOME.jpg`, createdAt: ts },
  { id: 6, title: "Coloring Page — Chibi Geisha", description: "Beautifully detailed coloring page of the chibi geisha character.", fileUrl: "https://bladeandquillartacademy.com/s/Chibi-Geisha-with-signature-and-text.jpg", fileType: "JPG", thumbnailUrl: `${SQ}/1654432548904-HPLDAUFZ93UUC7U40C1T/Chibi+Geisha+with+signature+and+text.jpg`, createdAt: ts },
  { id: 7, title: "Coloring Page — Kitty Princess", description: "Free printable coloring page of the regal kitty princess.", fileUrl: "https://bladeandquillartacademy.com/s/Kitty-princess-sketch-with-signature-and-text.jpg", fileType: "JPG", thumbnailUrl: `${SQ}/1654432558422-866Z4B4A91347XET1OLN/Kitty+princess+sketch+with+signature+and+text.jpg`, createdAt: ts },
  { id: 8, title: "Coloring Page — Baby Dragon", description: "Free printable coloring page featuring the adorable baby dragon.", fileUrl: "https://bladeandquillartacademy.com/s/Baby-dragon-with-signature-and-text-pjft.jpg", fileType: "JPG", thumbnailUrl: `${SQ}/1654432538976-2JJ0576R8S128MKNC3R6/Baby+dragon+with+signature+and+text.jpg`, createdAt: ts },
  { id: 9, title: "Coloring Page — Manga Girl", description: "Free printable manga-style girl coloring page with delicate line work.", fileUrl: "https://bladeandquillartacademy.com/s/Manga-girl-with-signature-and-text.jpg", fileType: "JPG", thumbnailUrl: `${SQ}/1654432538976-2JJ0576R8S128MKNC3R6/Baby+dragon+with+signature+and+text.jpg`, createdAt: ts },
];

export const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, name: "Lheeloo & Luna Cartoon Book", description: "The official Lheeloo & Luna illustrated cartoon book by Corinne — a charming story full of personality and beautiful original artwork.", price: 24.99, category: "physical" as const, imageUrl: `${SQ}/b23e74de-dc37-4929-877b-ad77351f2844/THE+BOOK+IS+LIVE+%281%29.png`, gumroadUrl: "https://bladeandquill.gumroad.com/l/qilks", featured: true, inStock: true, createdAt: ts },
  { id: 2, name: "Krita Quick Start Guide (eBook) — 2nd Edition", description: "Updated and expanded! 25 extra pages, links to free online tools, additional tips, updated for Krita 5.2.6.", price: 14.99, category: "digital" as const, imageUrl: `${SQ}/1ece7ddd-670a-4cd3-922a-826e5cc59f6f/new+image+for+gumroad+%281280+x+720+px%29.png`, gumroadUrl: "https://bladeandquill.gumroad.com/l/yjisjc", featured: true, inStock: true, createdAt: ts },
  { id: 3, name: "Krita Keyboard Shortcuts Booklet", description: "Speed up your workflow! Covers all the essential Krita keyboard shortcuts. Print it or reference digitally.", price: 7.99, category: "digital" as const, imageUrl: `${SQ}/d14d7a10-7b62-45ee-a21b-426af152221b/Pin+leading+to+my+shortcut+booklet.jpg`, gumroadUrl: "https://bladeandquill.gumroad.com", featured: false, inStock: true, createdAt: ts },
  { id: 4, name: "Blending Modes in Krita — Visual Guide", description: "Stop guessing what each blending mode does! Visual guide with real examples for every mode.", price: 9.99, category: "digital" as const, imageUrl: `${SQ}/60617ae2-f090-454a-8727-016083d37921/A+quick+guide+to+Krita%27s+Blending+modes_Feb.+2023.jpg`, gumroadUrl: "https://bladeandquill.gumroad.com", featured: false, inStock: true, createdAt: ts },
  { id: 5, name: "Digital Art Fundamentals Curriculum", description: "A complete beginner-to-intermediate curriculum for digital art. Covers drawing fundamentals, character design, digital painting techniques, and using Krita professionally.", price: 49.99, category: "curriculum" as const, imageUrl: `${SQ}/32c18851-4256-4c83-984b-a1d0a614e0b4/Faster+Krita+Fix+These+8+Lag+Issues+Now%21.jpg`, featured: true, inStock: true, createdAt: ts },
];

export const FALLBACK_CATEGORIES: Category[] = [
  { id: "physical", label: "Physical", productCount: 1 },
  { id: "digital", label: "Digital", productCount: 3 },
  { id: "curriculum", label: "Curriculum", productCount: 1 },
];

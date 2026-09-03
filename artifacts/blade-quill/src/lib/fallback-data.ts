/**
 * Static fallback data so Gallery, Tutorials, Downloads, and Shop pages
 * render real content even when the Express API / Supabase is unavailable.
 *
 * Content migrated from bladeandquillartacademy.com (Squarespace); all
 * images and files are rehosted locally under public/images and public/files.
 */

import type {
  GalleryItem,
  Tutorial,
  Download,
  Product,
} from "@workspace/api-client-react";

const IMG = "/images/squarespace";
const FILES = "/files";

const ts = "2025-01-01T00:00:00.000Z";

export const FALLBACK_GALLERY: GalleryItem[] = [
  { id: 1, title: "Lheeloo & Luna", imageUrl: `${IMG}/digital-paintings/lheeloo-and-luna-2025.jpg`, description: "Lheeloo the French Bulldog and Luna the mouse — the book duo, 2025", createdAt: ts },
  { id: 2, title: "French Bulldog Caricature", imageUrl: `${IMG}/digital-paintings/caricature-french-bulldog-krita.png`, description: "A playful caricature leaning into exaggeration — February 2026", createdAt: ts },
  { id: 3, title: "Sila", imageUrl: `${IMG}/digital-paintings/sila-01-23-2025.jpg`, description: "Original character portrait — digital painting, January 2025", createdAt: ts },
  { id: 4, title: "Fantasy Creature Guarding Dragon Egg", imageUrl: `${IMG}/digital-paintings/fantasy-creature-guarding-dragon-egg.jpg`, description: "A guardian creature protecting its precious dragon egg", createdAt: ts },
  { id: 5, title: "Chibi of the Sea", imageUrl: `${IMG}/digital-paintings/chibi-of-the-sea.jpg`, description: "An ocean-themed chibi character with underwater colors", createdAt: ts },
  { id: 6, title: "Child and Bear", imageUrl: `${IMG}/digital-paintings/child-and-bear.jpg`, description: "A heartwarming scene of a child with a bear companion", createdAt: ts },
  { id: 7, title: "Steampunk Cat", imageUrl: `${IMG}/digital-paintings/steampunk-cat.jpg`, description: "A whimsical steampunk cat character", createdAt: ts },
  { id: 8, title: "Steampunk Girl", imageUrl: `${IMG}/digital-paintings/steampunk.jpg`, description: "A steampunk-themed girl with mechanical accessories", createdAt: ts },
  { id: 9, title: "French Maid", imageUrl: `${IMG}/digital-paintings/maid.jpg`, description: "A chibi French maid character with charming details", createdAt: ts },
  { id: 10, title: "Chibi Ninja Man", imageUrl: `${IMG}/digital-paintings/chibi-ninja-man.png`, description: "A stealthy chibi ninja warrior", createdAt: ts },
  { id: 11, title: "Chibi Ninja Girl", imageUrl: `${IMG}/digital-paintings/chibi-ninja-girl.png`, description: "A fierce chibi kunoichi with throwing stars", createdAt: ts },
  { id: 12, title: "Geisha", imageUrl: `${IMG}/digital-paintings/geisha.jpg`, description: "An elegant geisha in full traditional attire", createdAt: ts },
  { id: 13, title: "Chibi Elephant", imageUrl: `${IMG}/digital-paintings/chibi-elephant.png`, description: "An adorable chibi elephant character", createdAt: ts },
  { id: 14, title: "Chibi Hippo", imageUrl: `${IMG}/digital-paintings/chibi-hippo.png`, description: "A playful chibi hippo with big personality", createdAt: ts },
  { id: 15, title: "Chibi Giraffe", imageUrl: `${IMG}/digital-paintings/chibi-giraffe.png`, description: "A tall chibi giraffe with expressive eyes", createdAt: ts },
  { id: 16, title: "Gnome Druid", imageUrl: `${IMG}/digital-paintings/gnome.jpg`, description: "A mystical gnome druid character with nature elements", createdAt: ts },
  { id: 17, title: "Chibi Dragon", imageUrl: `${IMG}/digital-paintings/chibi-dragon.png`, description: "A cute chibi dragon character sketch", createdAt: ts },
  { id: 18, title: "Dragon", imageUrl: `${IMG}/digital-paintings/dragon.jpg`, description: "A majestic full dragon digital painting", createdAt: ts },
  { id: 19, title: "Baby Dragon", imageUrl: `${IMG}/digital-paintings/dragon-baby.jpg`, description: "An adorable baby dragon with rich digital color work", createdAt: ts },
  { id: 20, title: "Japanese Girl", imageUrl: `${IMG}/digital-paintings/japanese-girl.jpg`, description: "A beautiful Japanese-inspired character portrait", createdAt: ts },
  { id: 21, title: "Landscape", imageUrl: `${IMG}/digital-paintings/landscape.jpg`, description: "A serene digital landscape painting", createdAt: ts },
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
  { id: 1, title: "A Guide to Krita's Blending Modes", description: "Free PDF guide to Krita's blending modes with visual examples.", fileUrl: `${FILES}/a-guide-to-krita-blending-modes-2023-krita-50.pdf`, fileType: "PDF", thumbnailUrl: `${IMG}/home/a-quick-guide-to-kritas-blending-modes-feb-2023.jpg`, createdAt: ts },
  { id: 2, title: "A Guide to Krita's Most Used Shortcuts", description: "Free PDF guide covering Krita's most used keyboard shortcuts.", fileUrl: `${FILES}/a-guide-to-krita-most-used-shortcuts-2023-krita-50.pdf`, fileType: "PDF", thumbnailUrl: `${IMG}/resources/a-quick-guide-to-kritas-shortcuts.jpg`, createdAt: ts },
  { id: 3, title: "Faster Krita — Fix These 8 Lag Issues Now", description: "Free PDF guide on identifying and fixing Krita lag and performance issues.", fileUrl: `${FILES}/guide-faster-krita-fix-these-8-lag-issues-now-mb4n.pdf`, fileType: "PDF", thumbnailUrl: `${IMG}/home/faster-krita-fix-these-8-lag-issues-now.jpg`, createdAt: ts },
  { id: 4, title: "Coloring Page — Steampunk Cat", description: "Free printable coloring page of the steampunk cat character.", fileUrl: `${FILES}/steampunk-cat-august-2023.jpg`, fileType: "JPG", thumbnailUrl: `${IMG}/free-coloring-pages-downloads/steampunk-cat-august-2023.jpg`, createdAt: ts },
  { id: 5, title: "Coloring Page — Chibi French Maid", description: "Free printable coloring page of the chibi French maid character.", fileUrl: `${FILES}/chibi-french-maid-with-signature-and-text.jpg`, fileType: "JPG", thumbnailUrl: `${IMG}/free-coloring-pages-downloads/chibi-french-maid-with-signature-and-text.jpg`, createdAt: ts },
  { id: 6, title: "Coloring Page — Gnome Druid", description: "Free printable coloring page of the gnome druid character.", fileUrl: `${FILES}/gnome-druide-with-signature-and-text.jpg`, fileType: "JPG", thumbnailUrl: `${IMG}/free-coloring-pages-downloads/gnome-druide-with-signature-and-text.jpg`, createdAt: ts },
  { id: 7, title: "Coloring Page — Chibi Geisha", description: "Beautifully detailed coloring page of the chibi geisha character.", fileUrl: `${FILES}/chibi-geisha-with-signature-and-text.jpg`, fileType: "JPG", thumbnailUrl: `${IMG}/free-coloring-pages-downloads/chibi-geisha-with-signature-and-text.jpg`, createdAt: ts },
  { id: 8, title: "Coloring Page — Kitty Princess", description: "Free printable coloring page of the regal kitty princess.", fileUrl: `${FILES}/kitty-princess-sketch-with-signature-and-text.jpg`, fileType: "JPG", thumbnailUrl: `${IMG}/free-coloring-pages-downloads/kitty-princess-sketch-with-signature-and-text.jpg`, createdAt: ts },
  { id: 9, title: "Coloring Page — Baby Dragon (Sitting)", description: "Free printable coloring page featuring the adorable baby dragon.", fileUrl: `${FILES}/baby-dragon2-with-signature-and-text.jpg`, fileType: "JPG", thumbnailUrl: `${IMG}/free-coloring-pages-downloads/baby-dragon2-with-signature-and-text.jpg`, createdAt: ts },
  { id: 10, title: "Coloring Page — Baby Dragon", description: "Free printable coloring page featuring the adorable baby dragon.", fileUrl: `${FILES}/baby-dragon-with-signature-and-text-pjft.jpg`, fileType: "JPG", thumbnailUrl: `${IMG}/free-coloring-pages-downloads/baby-dragon-with-signature-and-text.jpg`, createdAt: ts },
  { id: 11, title: "Coloring Page — Manga Girl", description: "Free printable manga-style girl coloring page with delicate line work.", fileUrl: `${FILES}/manga-girl-with-signature-and-text.jpg`, fileType: "JPG", thumbnailUrl: `${IMG}/free-coloring-pages-downloads/manga-girl-with-signature-and-text.jpg`, createdAt: ts },
  { id: 12, title: "Coloring Page — Friends Take Care of Each Other", description: "Free printable Lheeloo & Luna coloring page.", fileUrl: `${FILES}/color-friends-take-care-of-each-other-yyw2.png`, fileType: "PNG", thumbnailUrl: `${IMG}/free-coloring-pages-downloads/color-friends-take-care-of-each-other.png`, createdAt: ts },
];

export const FALLBACK_PRODUCTS: Product[] = [
  { id: 1, name: "Lheeloo & Luna Cartoon Book", description: "The official Lheeloo & Luna illustrated cartoon book by Corinne — a pure delight for both children and adults! Paperback on Amazon (currently out of print); eBook on Gumroad and Google Play.", price: 24.99, category: "physical" as const, imageUrl: `${IMG}/home/the-book-is-live-1.png`, gumroadUrl: "https://bladeandquill.gumroad.com/l/qilks", featured: true, inStock: true, createdAt: ts },
  { id: 3, name: "Super Fun Activity Book — Puzzle Games for Kids Ages 8–12", description: "Word searches, crosswords, mazes, spot-the-difference, trivia, coloring pages, drawing activities, and more — starring Lheeloo & Luna. Paperback on Amazon or printable version on Gumroad.", price: 11.99, category: "physical" as const, imageUrl: "/images/puzzle-book-front.png", gumroadUrl: "https://bladeandquill.gumroad.com/l/einoxf", featured: true, inStock: true, createdAt: ts },
];
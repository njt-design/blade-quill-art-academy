import { lazy } from "react";
import type { DesignSystemEntry } from "./types";

export const registry: DesignSystemEntry[] = [
  // --- Organisms ---
  { id: "navbar", name: "Navbar", category: "organism", description: "Site header with navigation, cart, and mobile menu.", demo: lazy(() => import("./demos/organisms/NavbarDemo")) },
  { id: "footer", name: "Footer", category: "organism", description: "Site footer with pages, social icons, newsletter signup, and admin link.", demo: lazy(() => import("./demos/organisms/FooterDemo")) },
  { id: "hero-block", name: "Hero Block", category: "organism", description: "Full-width hero section with heading, subheading, and CTA.", demo: lazy(() => import("./demos/organisms/HeroBlockDemo")) },
  { id: "cta-band-block", name: "CTA Band Block", category: "organism", description: "Horizontal call-to-action band (light and dark variants).", demo: lazy(() => import("./demos/organisms/CtaBandBlockDemo")) },
  { id: "feature-grid-block", name: "Feature Grid Block", category: "organism", description: "Icon + title + description grid for feature highlights.", demo: lazy(() => import("./demos/organisms/FeatureGridBlockDemo")) },
  { id: "image-gallery-block", name: "Image Gallery Block", category: "organism", description: "Responsive image grid with captions.", demo: lazy(() => import("./demos/organisms/ImageGalleryBlockDemo")) },
  { id: "text-block", name: "Text Block", category: "organism", description: "Rich-text content section with heading.", demo: lazy(() => import("./demos/organisms/TextBlockDemo")) },
  { id: "video-embed-block", name: "Video Embed Block", category: "organism", description: "YouTube embed with heading.", demo: lazy(() => import("./demos/organisms/VideoEmbedBlockDemo")) },

  // --- Molecules ---
  { id: "input-group", name: "Input Group", category: "molecule", description: "Input with addon icons or text.", demo: lazy(() => import("./demos/molecules/InputGroupDemo")) },
  { id: "button-group", name: "Button Group", category: "molecule", description: "Grouped buttons with shared border radius.", demo: lazy(() => import("./demos/molecules/ButtonGroupDemo")) },
  { id: "alert-dialog", name: "Alert Dialog", category: "molecule", description: "Confirmation dialog with cancel/action buttons.", demo: lazy(() => import("./demos/molecules/AlertDialogDemo")) },
  { id: "command", name: "Command", category: "molecule", description: "Searchable command palette.", demo: lazy(() => import("./demos/molecules/CommandDemo")) },
  { id: "pagination", name: "Pagination", category: "molecule", description: "Page navigation with prev/next.", demo: lazy(() => import("./demos/molecules/PaginationDemo")) },
  { id: "carousel", name: "Carousel", category: "molecule", description: "Horizontal content slider.", demo: lazy(() => import("./demos/molecules/CarouselDemo")) },
  { id: "navigation-menu", name: "Navigation Menu", category: "molecule", description: "Dropdown navigation with content panels.", demo: lazy(() => import("./demos/molecules/NavigationMenuDemo")) },

  // --- Atoms ---
  { id: "button", name: "Button", category: "atom", description: "Primary interactive element with multiple variants and sizes.", demo: lazy(() => import("./demos/atoms/ButtonDemo")) },
  { id: "badge", name: "Badge", category: "atom", description: "Status or category label.", demo: lazy(() => import("./demos/atoms/BadgeDemo")) },
  { id: "input", name: "Input", category: "atom", description: "Text input field.", demo: lazy(() => import("./demos/atoms/InputDemo")) },
  { id: "textarea", name: "Textarea", category: "atom", description: "Multi-line text input.", demo: lazy(() => import("./demos/atoms/TextareaDemo")) },
  { id: "label", name: "Label", category: "atom", description: "Form field label.", demo: lazy(() => import("./demos/atoms/LabelDemo")) },
  { id: "checkbox", name: "Checkbox", category: "atom", description: "Boolean toggle input.", demo: lazy(() => import("./demos/atoms/CheckboxDemo")) },
  { id: "radio-group", name: "Radio Group", category: "atom", description: "Single-select option list.", demo: lazy(() => import("./demos/atoms/RadioGroupDemo")) },
  { id: "switch", name: "Switch", category: "atom", description: "Toggle switch.", demo: lazy(() => import("./demos/atoms/SwitchDemo")) },
  { id: "slider", name: "Slider", category: "atom", description: "Range value input.", demo: lazy(() => import("./demos/atoms/SliderDemo")) },
  { id: "select", name: "Select", category: "atom", description: "Dropdown selection.", demo: lazy(() => import("./demos/atoms/SelectDemo")) },
  { id: "progress", name: "Progress", category: "atom", description: "Linear progress indicator.", demo: lazy(() => import("./demos/atoms/ProgressDemo")) },
  { id: "skeleton", name: "Skeleton", category: "atom", description: "Loading placeholder.", demo: lazy(() => import("./demos/atoms/SkeletonDemo")) },
  { id: "spinner", name: "Spinner", category: "atom", description: "Loading spinner animation.", demo: lazy(() => import("./demos/atoms/SpinnerDemo")) },
  { id: "avatar", name: "Avatar", category: "atom", description: "User image or initials.", demo: lazy(() => import("./demos/atoms/AvatarDemo")) },
  { id: "separator", name: "Separator", category: "atom", description: "Horizontal or vertical divider.", demo: lazy(() => import("./demos/atoms/SeparatorDemo")) },
  { id: "tooltip", name: "Tooltip", category: "atom", description: "Hover information popup.", demo: lazy(() => import("./demos/atoms/TooltipDemo")) },
  { id: "popover", name: "Popover", category: "atom", description: "Click-triggered floating content.", demo: lazy(() => import("./demos/atoms/PopoverDemo")) },
  { id: "dialog", name: "Dialog", category: "atom", description: "Modal overlay.", demo: lazy(() => import("./demos/atoms/DialogDemo")) },
  { id: "sheet", name: "Sheet", category: "atom", description: "Slide-out panel.", demo: lazy(() => import("./demos/atoms/SheetDemo")) },
  { id: "drawer", name: "Drawer", category: "atom", description: "Bottom sheet (mobile-friendly).", demo: lazy(() => import("./demos/atoms/DrawerDemo")) },
  { id: "dropdown-menu", name: "Dropdown Menu", category: "atom", description: "Context or action menu.", demo: lazy(() => import("./demos/atoms/DropdownMenuDemo")) },
  { id: "context-menu", name: "Context Menu", category: "atom", description: "Right-click triggered menu.", demo: lazy(() => import("./demos/atoms/ContextMenuDemo")) },
  { id: "hover-card", name: "Hover Card", category: "atom", description: "Hover-triggered info card.", demo: lazy(() => import("./demos/atoms/HoverCardDemo")) },
  { id: "tabs", name: "Tabs", category: "atom", description: "Tabbed content panels.", demo: lazy(() => import("./demos/atoms/TabsDemo")) },
  { id: "accordion", name: "Accordion", category: "atom", description: "Expandable content sections.", demo: lazy(() => import("./demos/atoms/AccordionDemo")) },
  { id: "collapsible", name: "Collapsible", category: "atom", description: "Expandable/collapsible wrapper.", demo: lazy(() => import("./demos/atoms/CollapsibleDemo")) },
  { id: "alert", name: "Alert", category: "atom", description: "Inline feedback message.", demo: lazy(() => import("./demos/atoms/AlertDemo")) },
  { id: "card", name: "Card", category: "atom", description: "Content container with header/body/footer.", demo: lazy(() => import("./demos/atoms/CardDemo")) },
  { id: "table", name: "Table", category: "atom", description: "Data table.", demo: lazy(() => import("./demos/atoms/TableDemo")) },
  { id: "toggle", name: "Toggle", category: "atom", description: "Two-state toggle button.", demo: lazy(() => import("./demos/atoms/ToggleDemo")) },
  { id: "toggle-group", name: "Toggle Group", category: "atom", description: "Group of toggle buttons (single or multi select).", demo: lazy(() => import("./demos/atoms/ToggleGroupDemo")) },
  { id: "scroll-area", name: "Scroll Area", category: "atom", description: "Custom-styled scrollable area.", demo: lazy(() => import("./demos/atoms/ScrollAreaDemo")) },
  { id: "aspect-ratio", name: "Aspect Ratio", category: "atom", description: "Constrained aspect ratio container.", demo: lazy(() => import("./demos/atoms/AspectRatioDemo")) },
  { id: "calendar", name: "Calendar", category: "atom", description: "Date picker calendar.", demo: lazy(() => import("./demos/atoms/CalendarDemo")) },
  { id: "breadcrumb", name: "Breadcrumb", category: "atom", description: "Navigation breadcrumb trail.", demo: lazy(() => import("./demos/atoms/BreadcrumbDemo")) },
  { id: "kbd", name: "Kbd", category: "atom", description: "Keyboard shortcut display.", demo: lazy(() => import("./demos/atoms/KbdDemo")) },
  { id: "input-otp", name: "Input OTP", category: "atom", description: "One-time password input.", demo: lazy(() => import("./demos/atoms/InputOtpDemo")) },
  { id: "resizable", name: "Resizable", category: "atom", description: "Resizable panel layout.", demo: lazy(() => import("./demos/atoms/ResizableDemo")) },
  { id: "empty", name: "Empty", category: "atom", description: "Empty state placeholder.", demo: lazy(() => import("./demos/atoms/EmptyDemo")) },
];

export function getEntries(category: DesignSystemEntry["category"]) {
  return registry.filter((e) => e.category === category);
}

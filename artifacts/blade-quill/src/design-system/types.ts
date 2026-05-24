import type { ComponentType } from "react";

export type AtomicCategory = "organism" | "molecule" | "atom";

export type DesignSystemEntry = {
  id: string;
  name: string;
  category: AtomicCategory;
  description?: string;
  demo: ComponentType;
};

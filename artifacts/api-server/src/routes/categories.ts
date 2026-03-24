import { Router, type IRouter, type Request, type Response } from "express";
import { supabase } from "@workspace/db";

const router: IRouter = Router();

const CATEGORY_LABELS: Record<string, string> = {
  physical: "Books & Prints",
  digital: "Digital Guides",
  curriculum: "Curriculum",
};

router.get("/categories", async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("category");

    if (error) throw error;

    const countMap: Record<string, number> = {};
    for (const row of data ?? []) {
      countMap[row.category] = (countMap[row.category] || 0) + 1;
    }

    const categories = Object.entries(countMap).map(([cat, count]) => ({
      id: cat,
      label: CATEGORY_LABELS[cat] ?? cat,
      productCount: count,
    }));

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;

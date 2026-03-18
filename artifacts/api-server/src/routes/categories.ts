import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

const CATEGORY_LABELS: Record<string, string> = {
  physical: "Books & Prints",
  digital: "Digital Guides",
  curriculum: "Curriculum",
};

router.get("/categories", async (_req: Request, res: Response): Promise<void> => {
  try {
    const counts = await db
      .select({
        category: productsTable.category,
        count: sql<number>`count(*)::int`,
      })
      .from(productsTable)
      .groupBy(productsTable.category);

    const categories = counts.map((row) => ({
      id: row.category,
      label: CATEGORY_LABELS[row.category] ?? row.category,
      productCount: row.count,
    }));

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;

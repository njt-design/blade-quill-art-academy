import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListProductsQueryParams,
  GetProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const query = ListProductsQueryParams.parse(req.query);
    let rows;
    if (query.category) {
      rows = await db
        .select()
        .from(productsTable)
        .where(eq(productsTable.category, query.category as "physical" | "digital" | "curriculum"));
    } else {
      rows = await db.select().from(productsTable);
    }
    const products = rows.map((p) => ({
      ...p,
      price: parseFloat(p.price),
      createdAt: p.createdAt.toISOString(),
    }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/products/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = GetProductParams.parse(req.params);
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id));
    if (rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const p = rows[0];
    res.json({
      ...p,
      price: parseFloat(p.price),
      createdAt: p.createdAt.toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;

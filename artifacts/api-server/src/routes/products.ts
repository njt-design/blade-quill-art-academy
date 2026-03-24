import { Router, type IRouter, type Request, type Response } from "express";
import { supabase } from "@workspace/db";
import {
  ListProductsQueryParams,
  GetProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req: Request, res: Response): Promise<void> => {
  try {
    const query = ListProductsQueryParams.parse(req.query);
    let q = supabase.from("products").select("*");
    if (query.category) {
      q = q.eq("category", query.category);
    }
    const { data, error } = await q;
    if (error) throw error;

    const products = (data ?? []).map((p) => ({
      ...p,
      price: parseFloat(p.price),
      createdAt: p.created_at,
    }));
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.get("/products/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = GetProductParams.parse(req.params);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      ...data,
      price: parseFloat(data.price),
      createdAt: data.created_at,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;

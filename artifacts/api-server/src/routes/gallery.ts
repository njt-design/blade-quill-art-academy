import { Router, type IRouter } from "express";
import { supabase } from "@workspace/db";

const router: IRouter = Router();

router.get("/gallery", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const items = (data ?? []).map((g) => ({
      ...g,
      createdAt: g.created_at,
    }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

export default router;

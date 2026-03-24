import { Router, type IRouter } from "express";
import { supabase } from "@workspace/db";

const router: IRouter = Router();

router.get("/downloads", async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from("downloads")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const downloads = (data ?? []).map((d) => ({
      ...d,
      createdAt: d.created_at,
    }));
    res.json(downloads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch downloads" });
  }
});

export default router;

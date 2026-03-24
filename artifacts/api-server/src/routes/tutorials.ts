import { Router, type IRouter, type Request, type Response } from "express";
import { supabase } from "@workspace/db";
import { ListTutorialsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tutorials", async (req: Request, res: Response): Promise<void> => {
  try {
    const query = ListTutorialsQueryParams.parse(req.query);

    let q = supabase.from("tutorials").select("*").order("sort_order", { ascending: true });

    if (query.featured !== undefined) {
      q = q.eq("featured", query.featured);
    }
    if (query.topic) {
      q = q.eq("topic", query.topic);
    }

    const { data, error } = await q;
    if (error) throw error;

    const tutorials = (data ?? []).map((t) => ({
      ...t,
      createdAt: t.created_at,
    }));
    res.json(tutorials);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tutorials" });
  }
});

export default router;

import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { downloadsTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/downloads", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(downloadsTable)
      .orderBy(asc(downloadsTable.sortOrder));
    const downloads = rows.map((d) => ({
      ...d,
      createdAt: d.createdAt.toISOString(),
    }));
    res.json(downloads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch downloads" });
  }
});

export default router;

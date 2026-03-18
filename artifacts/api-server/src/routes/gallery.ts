import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { galleryTable } from "@workspace/db";
import { asc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/gallery", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(galleryTable)
      .orderBy(asc(galleryTable.sortOrder));
    const items = rows.map((g) => ({
      ...g,
      createdAt: g.createdAt.toISOString(),
    }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch gallery" });
  }
});

export default router;

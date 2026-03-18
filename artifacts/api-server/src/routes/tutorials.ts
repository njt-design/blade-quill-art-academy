import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tutorialsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { ListTutorialsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tutorials", async (req, res) => {
  try {
    const query = ListTutorialsQueryParams.parse(req.query);
    let rows;
    if (query.featured !== undefined) {
      rows = await db
        .select()
        .from(tutorialsTable)
        .where(eq(tutorialsTable.featured, query.featured))
        .orderBy(asc(tutorialsTable.sortOrder));
    } else {
      rows = await db
        .select()
        .from(tutorialsTable)
        .orderBy(asc(tutorialsTable.sortOrder));
    }
    const tutorials = rows.map((t) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    }));
    res.json(tutorials);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tutorials" });
  }
});

export default router;

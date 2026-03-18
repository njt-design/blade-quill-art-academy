import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { tutorialsTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { ListTutorialsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/tutorials", async (req: Request, res: Response): Promise<void> => {
  try {
    const query = ListTutorialsQueryParams.parse(req.query);

    const conditions = [];
    if (query.featured !== undefined) {
      conditions.push(eq(tutorialsTable.featured, query.featured));
    }
    if (query.topic) {
      conditions.push(eq(tutorialsTable.topic, query.topic));
    }

    const rows = await db
      .select()
      .from(tutorialsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(tutorialsTable.sortOrder));

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

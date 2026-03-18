import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req: Request, res: Response): Promise<void> => {
  try {
    const body = SubmitContactBody.parse(req.body);
    await db.insert(contactsTable).values({
      name: body.name,
      email: body.email,
      message: body.message,
    });
    res.json({ success: true, message: "Thanks for reaching out! Corinne will get back to you soon." });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      res.status(400).json({ error: "Invalid form data" });
      return;
    }
    res.status(500).json({ error: "Failed to submit contact form" });
  }
});

export default router;

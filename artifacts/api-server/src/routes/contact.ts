import { Router, type IRouter, type Request, type Response } from "express";
import { supabase } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req: Request, res: Response): Promise<void> => {
  try {
    const body = SubmitContactBody.parse(req.body);
    // The contacts table only has name/email/message columns, so publisher
    // metadata (company, dummy-book intent) is folded into the message text.
    const messageParts = [
      ...(body.intent === "dummy-book"
        ? ["[Publisher dummy book request]"]
        : []),
      ...(body.company ? [`Company: ${body.company}`] : []),
      body.message,
    ];
    const { error } = await supabase.from("contacts").insert({
      name: body.name,
      email: body.email,
      message: messageParts.join("\n"),
    });
    if (error) throw error;
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

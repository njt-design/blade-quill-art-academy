import { Router, type IRouter, type Request, type Response } from "express";
import {
  CheckoutError,
  createCheckoutSession,
  getOrderSuccess,
  handleStripeWebhook,
  resolveDownloadRedirect,
} from "@workspace/checkout";
import {
  CreateCheckoutSessionBody,
  GetOrderSuccessQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function getBaseUrl(req: Request): string {
  const host =
    (req.headers["x-forwarded-host"] as string) ||
    (req.headers.host as string) ||
    "localhost";
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  return `${proto}://${host}`;
}

function sendError(res: Response, err: unknown): void {
  if (err instanceof CheckoutError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}

router.post("/checkout", async (req: Request, res: Response): Promise<void> => {
  try {
    const body = CreateCheckoutSessionBody.parse(req.body);
    const result = await createCheckoutSession({
      productId: body.productId,
      quantity: body.quantity,
      productSlug: body.productSlug,
      baseUrl: getBaseUrl(req),
    });
    res.json(result);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ZodError") {
      res.status(400).json({ error: "Invalid request" });
      return;
    }
    sendError(res, err);
  }
});

router.get(
  "/checkout/success",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { session_id } = GetOrderSuccessQueryParams.parse(req.query);
      const result = await getOrderSuccess(session_id);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "ZodError") {
        res.status(400).json({ error: "Invalid request" });
        return;
      }
      sendError(res, err);
    }
  }
);

router.post(
  "/stripe/webhook",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await handleStripeWebhook({
        rawBody: req.body as Buffer,
        signature: req.headers["stripe-signature"],
        allowUnsignedInDev: true,
      });
      res.json(result);
    } catch (err) {
      if (err instanceof CheckoutError) {
        res.status(err.status).send(err.message);
        return;
      }
      console.error(err);
      res.status(500).send("Webhook error");
    }
  }
);

router.get(
  "/download/:token",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const raw = req.params.token;
      const token = Array.isArray(raw) ? String(raw[0] ?? "") : String(raw ?? "");
      const url = await resolveDownloadRedirect(token);
      res.redirect(302, url);
    } catch (err) {
      sendError(res, err);
    }
  }
);

export default router;

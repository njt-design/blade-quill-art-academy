export class InsightsAuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = "InsightsAuthError";
    this.status = status;
  }
}

/**
 * Validate a Tina Cloud identity token.
 * Local Tina admin uses id_token "LOCAL" — allow that in non-production.
 *
 * Uses dynamic import() because @tinacms/auth is ESM-only and Vercel Node
 * functions compile to CommonJS (static require() would throw ERR_REQUIRE_ESM).
 */
export async function assertTinaAuthorized(opts: {
  clientId: string | undefined;
  authorization: string | undefined;
}): Promise<void> {
  const clientId = opts.clientId?.trim();
  const authorization = opts.authorization?.trim();

  if (!clientId) {
    throw new InsightsAuthError("Tina client ID is not configured", 500);
  }
  if (!authorization) {
    throw new InsightsAuthError("Sign in with Tina to view Insights");
  }

  const token = authorization.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    throw new InsightsAuthError("Sign in with Tina to view Insights");
  }

  if (
    token === "LOCAL" &&
    (process.env.NODE_ENV === "development" ||
      process.env.TINA_PUBLIC_IS_LOCAL === "true")
  ) {
    return;
  }

  let user: { verified?: boolean } | null | undefined;
  try {
    const { isUserAuthorized } = await import("@tinacms/auth");
    user = await isUserAuthorized({
      clientID: clientId,
      token: authorization.startsWith("Bearer ")
        ? authorization
        : `Bearer ${token}`,
    });
  } catch (err) {
    console.error("Tina auth check failed:", err);
    throw new InsightsAuthError("Sign in with Tina to view Insights");
  }

  if (!user || !user.verified) {
    throw new InsightsAuthError("Sign in with Tina to view Insights");
  }
}

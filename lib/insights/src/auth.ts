export class InsightsAuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.name = "InsightsAuthError";
    this.status = status;
  }
}

interface TinaCloudUser {
  id?: string;
  email?: string;
  verified?: boolean;
  enabled?: boolean;
}

/**
 * Validate a Tina Cloud identity token by calling Tina's identity API
 * directly. Avoids `@tinacms/auth` — that package is ESM-only and Vercel's
 * CJS bundling of api/ turns dynamic import() into require(), which throws
 * ERR_REQUIRE_ESM at runtime.
 *
 * Local Tina admin uses id_token "LOCAL" — allow that in non-production.
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

  const bearer = authorization.startsWith("Bearer ")
    ? authorization
    : `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(
      `https://identity.tinajs.io/v2/apps/${encodeURIComponent(clientId)}/currentUser`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: bearer,
        },
      }
    );
  } catch (err) {
    console.error("Tina identity request failed:", err);
    throw new InsightsAuthError("Could not verify Tina session");
  }

  if (!res.ok) {
    console.error("Tina identity rejected token:", res.status);
    throw new InsightsAuthError(
      "Tina session expired or was rejected. Sign in again at /admin, then reopen Insights."
    );
  }

  let user: TinaCloudUser;
  try {
    user = (await res.json()) as TinaCloudUser;
  } catch {
    throw new InsightsAuthError("Could not verify Tina session");
  }

  // Accept any identity payload that looks like a real user. Some Tina
  // collaborator accounts omit `verified` even when the session is valid.
  if (!user || (!user.id && !user.email)) {
    throw new InsightsAuthError(
      "Tina session expired or was rejected. Sign in again at /admin, then reopen Insights."
    );
  }

  if (user.enabled === false) {
    throw new InsightsAuthError("This Tina account is disabled");
  }
}

import { useState } from "react";

export type NewsletterStatus = "idle" | "submitting" | "success" | "error";

interface NewsletterState {
  status: NewsletterStatus;
  message: string;
}

const GENERIC_ERROR = "Something went wrong. Please try again later.";

/**
 * Newsletter signups post straight to the Vercel function (/api/newsletter),
 * which stores the address in a Resend Audience. Not part of the generated
 * API client because the Express dev server has no newsletter route.
 */
export function useNewsletterSignup() {
  const [state, setState] = useState<NewsletterState>({
    status: "idle",
    message: "",
  });

  async function subscribe(email: string): Promise<boolean> {
    setState({ status: "submitting", message: "" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = (await res.json().catch(() => null)) as {
        message?: string;
        error?: string;
      } | null;
      if (!res.ok) {
        setState({ status: "error", message: json?.error || GENERIC_ERROR });
        return false;
      }
      setState({
        status: "success",
        message: json?.message || "You're on the list!",
      });
      return true;
    } catch {
      setState({ status: "error", message: GENERIC_ERROR });
      return false;
    }
  }

  return { ...state, subscribe };
}

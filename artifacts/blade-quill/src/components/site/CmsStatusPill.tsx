import { useEffect, useState } from "react";
import type { LiveTinaFreshness } from "@/hooks/use-live-tina";
import { hasTinaSession } from "@/lib/tina-auth";
import { isInTinaEditor } from "@/lib/tina-live";

/**
 * Subtle status for Corinne after a CMS save. Only visible when she has an
 * active Tina session on this origin (signed in via /admin). Visitors never see it.
 */
export function CmsStatusPill({ freshness }: { freshness: LiveTinaFreshness }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isInTinaEditor() || !hasTinaSession()) {
      setVisible(false);
      return;
    }
    if (freshness === "live") {
      setMessage("Showing your latest saved content");
      setVisible(true);
    } else if (freshness === "unavailable") {
      setMessage("Live refresh unavailable — showing last deployed version (~50s after save)");
      setVisible(true);
    } else if (freshness === "loading") {
      setMessage("Checking for saved updates…");
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [freshness]);

  useEffect(() => {
    if (!visible || freshness === "loading") return;
    const t = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(t);
  }, [visible, freshness, message]);

  if (!visible || !message) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-[80] -translate-x-1/2 px-4 py-2 text-xs shadow-lg"
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        borderRadius: 999,
        fontFamily: "var(--f-sans)",
        letterSpacing: "0.02em",
        maxWidth: "min(92vw, 420px)",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
}

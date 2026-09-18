import { useEffect, useState } from "react";
import { canRearrangeGrids } from "@/lib/grid-reorder";

/**
 * Whether the "Rearrange" button should show on CMS-owned grids.
 *
 * Re-evaluates when the tab regains focus or localStorage changes in another
 * tab, so signing in to /admin in a second tab reveals the button here
 * without a manual reload.
 */
export function useCanRearrange(): boolean {
  const [can, setCan] = useState(() => canRearrangeGrids());

  useEffect(() => {
    const update = () => setCan(canRearrangeGrids());
    window.addEventListener("focus", update);
    window.addEventListener("storage", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      window.removeEventListener("focus", update);
      window.removeEventListener("storage", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return can;
}

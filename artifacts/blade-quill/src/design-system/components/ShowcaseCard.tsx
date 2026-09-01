import type { ReactNode } from "react";
import type { EntryGuidelines } from "../types";

interface Props {
  id: string;
  name: string;
  description?: string;
  guidelines?: EntryGuidelines;
  children: ReactNode;
}

/**
 * Wraps a live demo with its name, description, and — when provided — an
 * "Admin notes" panel: usage, where it's used/edited, image specs, and
 * character limits mined from the Tina schema.
 */
export function ShowcaseCard({ id, name, description, guidelines, children }: Props) {
  const g = guidelines;
  const hasAdminNotes =
    g &&
    (g.usage ||
      g.usedOn?.length ||
      g.cmsLocation ||
      g.images?.length ||
      g.charLimits?.length ||
      g.notes?.length);

  return (
    <div id={id} className="scroll-mt-24 rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg mb-1">{name}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      <div className="rounded-lg border border-border/50 bg-background p-6 overflow-x-auto">
        {children}
      </div>

      {hasAdminNotes && (
        <div className="mt-4 rounded-lg border border-border/50 bg-secondary/40 p-4 space-y-3 text-sm">
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground">
            Admin notes
          </p>

          {g.usage && <p>{g.usage}</p>}

          {(g.usedOn?.length || g.cmsLocation) && (
            <div className="flex flex-col gap-1 text-muted-foreground">
              {g.usedOn && g.usedOn.length > 0 && (
                <p>
                  <span className="font-medium text-foreground">Used on: </span>
                  {g.usedOn.join(" · ")}
                </p>
              )}
              {g.cmsLocation && (
                <p>
                  <span className="font-medium text-foreground">Edit in Tina: </span>
                  {g.cmsLocation}
                </p>
              )}
            </div>
          )}

          {g.images && g.images.length > 0 && (
            <div>
              <p className="font-medium mb-1">Images</p>
              <table className="w-full text-left text-sm">
                <tbody>
                  {g.images.map((img) => (
                    <tr key={img.field} className="border-t border-border/50">
                      <td className="py-1.5 pr-3 font-mono text-xs whitespace-nowrap align-top">
                        {img.field}
                      </td>
                      <td className="py-1.5 text-muted-foreground">{img.spec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {g.charLimits && g.charLimits.length > 0 && (
            <div>
              <p className="font-medium mb-1.5">Character limits</p>
              <div className="flex flex-wrap gap-1.5">
                {g.charLimits.map((c) => (
                  <span
                    key={c.field}
                    className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-xs"
                  >
                    {c.field}
                    <span className="text-muted-foreground">≤ {c.limit}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {g.notes && g.notes.length > 0 && (
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {g.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

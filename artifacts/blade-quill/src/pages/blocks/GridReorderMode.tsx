/**
 * iPhone-homescreen-style rearrange mode for CMS-owned grids (gallery
 * artwork, downloads).
 *
 * Renders the grid in the same layout as its public view — masonry columns
 * for the gallery, uniform cards for downloads — so what the admin sees is
 * what visitors see. Tiles jiggle gently; dragging one makes the others
 * reflow live into the layout that will persist, so the item lands in the
 * exact visual spot it was dropped. Touch uses a short press-and-hold to
 * start a drag, like iOS. Save persists through Tina (lib/grid-reorder.ts).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  MouseSensor,
  TouchSensor,
  closestCenter,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { FileText, Move } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Btn } from "@/components/site/Btn";
import {
  fetchGridReorderDoc,
  saveGridOrder,
  type GridReorderConfig,
  type GridReorderDoc,
} from "@/lib/grid-reorder";
import { invalidateLiveContentCache } from "@/hooks/use-live-content";

/** How reorder tiles are laid out — mirrors the grid's public view. */
export type GridReorderVariant = "masonry" | "cards";

const CONTAINER_CLASSES: Record<GridReorderVariant, string> = {
  // Same classes as GalleryGridBlock's masonry.
  masonry: "columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 pb-20",
  // Same grid as DownloadsGridBlock's cards.
  cards:
    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-20",
};

export interface ReorderTileData {
  title: string;
  imageUrl: string | null;
}

interface ReorderTile extends ReorderTileData {
  /** Stable drag id, derived from the item's original position. */
  id: string;
  /** Index in the document's current list. */
  originalIndex: number;
}

/**
 * Prefer the tile directly under the pointer; fall back to the nearest tile
 * when the pointer is over a gap between tiles.
 */
const collisionDetection: CollisionDetection = (args) => {
  const within = pointerWithin(args);
  return within.length > 0 ? within : closestCenter(args);
};

/** Tile artwork/thumbnail — shared between the grid tile and drag overlay. */
function TileContent({
  tile,
  variant,
}: {
  tile: ReorderTileData;
  variant: GridReorderVariant;
}) {
  if (variant === "masonry") {
    return tile.imageUrl ? (
      <img
        src={tile.imageUrl}
        alt={tile.title}
        className="w-full h-auto pointer-events-none"
        draggable={false}
      />
    ) : (
      <div className="aspect-[3/4] grid place-items-center bg-secondary/50">
        <FileText className="w-10 h-10 text-muted-foreground/30" />
      </div>
    );
  }
  return (
    <div className="flex flex-col bg-card h-full">
      {tile.imageUrl ? (
        <div className="aspect-[4/3] img-fit-wrap bg-secondary/30">
          <img
            src={tile.imageUrl}
            alt={tile.title}
            className="img-fit pointer-events-none"
            draggable={false}
          />
        </div>
      ) : (
        <div className="aspect-[4/3] grid place-items-center bg-secondary/50">
          <FileText className="w-10 h-10 text-muted-foreground/30" />
        </div>
      )}
      <div className="p-3">
        <p className="text-sm font-normal line-clamp-2">{tile.title}</p>
      </div>
    </div>
  );
}

function SortableTile({
  tile,
  position,
  variant,
  jiggleAlt,
}: {
  tile: ReorderTile;
  position: number;
  variant: GridReorderVariant;
  jiggleAlt: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: tile.id,
    // framer-motion `layout` owns all movement animation.
    animateLayoutChanges: () => false,
  });

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 550, damping: 40 }}
      ref={setNodeRef}
      className={`relative touch-none select-none ${
        variant === "masonry" ? "break-inside-avoid" : ""
      }`}
      {...attributes}
      {...listeners}
      aria-label={`${tile.title} — position ${position}`}
    >
      <div
        className={`rounded-lg overflow-hidden border border-border/50 bg-muted transition-opacity h-full ${
          isDragging
            ? "opacity-40 saturate-50"
            : `cursor-grab ${jiggleAlt ? "bq-jiggle-alt" : "bq-jiggle"}`
        }`}
      >
        <TileContent tile={tile} variant={variant} />
      </div>
    </motion.div>
  );
}

/** The admin-only pill that opens rearrange mode on a grid. */
export function RearrangeButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="mb-4 flex justify-end">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3.5 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition-colors hover:text-foreground hover:border-foreground/40"
        title="Drag items into a new order (admin only)"
      >
        <Move className="w-3.5 h-3.5" aria-hidden />
        {label}
      </button>
    </div>
  );
}

export default function GridReorderMode({
  config,
  variant,
  tileFor,
  onCancel,
  onSaved,
}: {
  config: GridReorderConfig;
  variant: GridReorderVariant;
  /** Map a raw CMS list item to its tile display data. */
  tileFor: (raw: Record<string, unknown>, index: number) => ReorderTileData;
  onCancel: () => void;
  /** Called after a successful save with the raw items in their new order. */
  onSaved: (orderedRaw: Record<string, unknown>[]) => void;
}) {
  const { toast } = useToast();
  const [doc, setDoc] = useState<GridReorderDoc | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tiles, setTiles] = useState<ReorderTile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const draggingRef = useRef(false);

  const load = useCallback(() => {
    setLoadError(null);
    setDoc(null);
    fetchGridReorderDoc(config)
      .then((loaded) => {
        setDoc(loaded);
        setTiles(
          loaded.items.map((raw, index) => ({
            id: `item-${index}`,
            originalIndex: index,
            ...tileFor(raw, index),
          }))
        );
      })
      .catch((err: unknown) => {
        setLoadError(
          err instanceof Error ? err.message : "Couldn't load this page."
        );
      });
    // config/tileFor are stable per grid; this runs once per mode entry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const sensors = useSensors(
    // Small distance so plain clicks don't start a drag on desktop…
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    // …and an iOS-style press-and-hold on touch.
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 8 },
    })
  );

  const dirty = tiles.some((tile, index) => tile.originalIndex !== index);
  const activeTile = useMemo(
    () => tiles.find((tile) => tile.id === activeId) ?? null,
    [tiles, activeId]
  );

  const moveTile = useCallback((activeKey: unknown, overKey: unknown) => {
    if (!overKey || activeKey === overKey) return;
    setTiles((current) => {
      const from = current.findIndex((t) => t.id === activeKey);
      const to = current.findIndex((t) => t.id === overKey);
      if (from < 0 || to < 0 || from === to) return current;
      return arrayMove(current, from, to);
    });
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    draggingRef.current = true;
  }, []);

  // Reorder live while dragging: the grid reflows into the exact layout that
  // will persist, so the drop spot is never a surprise.
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      moveTile(event.active.id, event.over?.id);
    },
    [moveTile]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      moveTile(event.active.id, event.over?.id);
      setActiveId(null);
      draggingRef.current = false;
    },
    [moveTile]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    draggingRef.current = false;
  }, []);

  const handleSave = useCallback(async () => {
    if (!doc || saving) return;
    setSaving(true);
    try {
      const order = tiles.map((tile) => tile.originalIndex);
      await saveGridOrder(config, doc, order);
      invalidateLiveContentCache();
      toast({ title: "New order saved" });
      onSaved(order.map((originalIndex) => doc.items[originalIndex]));
    } catch (err) {
      toast({
        title: "Couldn't save the new order",
        description:
          err instanceof Error ? err.message : "Please try again in a moment.",
        variant: "destructive",
      });
      setSaving(false);
    }
  }, [doc, saving, tiles, toast, onSaved, config]);

  const handleCancel = useCallback(() => {
    if (saving) return;
    if (dirty && !window.confirm("Discard the new order?")) return;
    onCancel();
  }, [saving, dirty, onCancel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // While a drag is active, Escape cancels the drag (dnd-kit handles it).
      if (e.key === "Escape" && !draggingRef.current) handleCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleCancel]);

  // Portal to body: ancestors keep a transform from the page-entrance
  // animation, which would make `position: fixed` element-relative.
  const actionBar = createPortal(
    <div className="fixed bottom-4 left-1/2 z-[1000] -translate-x-1/2 flex items-center gap-2 rounded-full border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
      <span className="hidden sm:block px-2 text-xs text-muted-foreground">
        Drag items to rearrange
      </span>
      <Btn kind="outline" size="sm" onClick={handleCancel} disabled={saving}>
        Cancel
      </Btn>
      <Btn
        kind="primary"
        size="sm"
        onClick={handleSave}
        disabled={!dirty || saving || !doc}
      >
        {saving ? "Saving…" : "Save order"}
      </Btn>
    </div>,
    document.body
  );

  if (loadError) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-lg">
        <p className="text-sm text-muted-foreground mb-4">{loadError}</p>
        <div className="flex justify-center gap-3">
          <Btn kind="outline" size="sm" onClick={onCancel}>
            Back
          </Btn>
          <Btn kind="primary" size="sm" onClick={load}>
            Retry
          </Btn>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className={CONTAINER_CLASSES[variant]}>
        {Array.from({ length: variant === "masonry" ? 9 : 8 }).map((_, i) => (
          <div
            key={i}
            className={`rounded-lg bg-muted animate-pulse ${
              variant === "masonry"
                ? "break-inside-avoid aspect-[3/4]"
                : "h-64"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext items={tiles.map((t) => t.id)}>
          {/* Same layout classes as the grid's public view, so the drop
              position matches what visitors will see. */}
          <div className={CONTAINER_CLASSES[variant]}>
            {tiles.map((tile, index) => (
              <SortableTile
                key={tile.id}
                tile={tile}
                position={index + 1}
                variant={variant}
                jiggleAlt={index % 2 === 1}
              />
            ))}
          </div>
        </SortableContext>
        {createPortal(
          <DragOverlay adjustScale={false}>
            {activeTile ? (
              <div className="rounded-lg overflow-hidden border border-border/50 shadow-2xl ring-2 ring-[var(--ink)]/25 scale-[1.04] cursor-grabbing h-full">
                <TileContent tile={activeTile} variant={variant} />
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
      {actionBar}
    </>
  );
}

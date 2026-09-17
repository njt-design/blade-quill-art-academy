/**
 * iPhone-homescreen-style rearrange mode for the Art Gallery Grid.
 *
 * Keeps the exact same masonry layout as the public gallery (same column
 * CSS, natural image sizes) so what the admin sees is what visitors see.
 * Tiles jiggle gently; dragging one makes the others reflow live into the
 * layout that will persist, so the artwork lands in the exact visual spot
 * it was dropped. Touch uses a short press-and-hold to start a drag, like
 * iOS. Save persists through Tina (see lib/gallery-reorder.ts).
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
import { useToast } from "@/hooks/use-toast";
import { Btn } from "@/components/site/Btn";
import { toGalleryArtwork, type GalleryArtwork } from "@/lib/gallery";
import {
  fetchGalleryReorderDoc,
  saveGalleryOrder,
  type GalleryReorderDoc,
} from "@/lib/gallery-reorder";
import { invalidateLiveContentCache } from "@/hooks/use-live-content";

interface ReorderTile {
  /** Stable drag id, derived from the artwork's original position. */
  id: string;
  /** Index in the document's current artworks array. */
  originalIndex: number;
  title: string;
  imageUrl: string;
}

/**
 * Prefer the tile directly under the pointer; fall back to the nearest tile
 * when the pointer is over a gap between masonry tiles.
 */
const collisionDetection: CollisionDetection = (args) => {
  const within = pointerWithin(args);
  return within.length > 0 ? within : closestCenter(args);
};

function SortableArtwork({
  tile,
  position,
  jiggleAlt,
}: {
  tile: ReorderTile;
  position: number;
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
      className="break-inside-avoid relative touch-none select-none"
      {...attributes}
      {...listeners}
      aria-label={`${tile.title} — position ${position}`}
    >
      <div
        className={`rounded-lg overflow-hidden border border-border/50 bg-muted transition-opacity ${
          isDragging
            ? "opacity-40 saturate-50"
            : `cursor-grab ${jiggleAlt ? "bq-jiggle-alt" : "bq-jiggle"}`
        }`}
      >
        <img
          src={tile.imageUrl}
          alt={tile.title}
          className="w-full h-auto pointer-events-none"
          draggable={false}
        />
      </div>
    </motion.div>
  );
}

export default function GalleryReorderMode({
  onCancel,
  onSaved,
}: {
  onCancel: () => void;
  /** Called after a successful save with the artworks in their new order. */
  onSaved: (items: GalleryArtwork[]) => void;
}) {
  const { toast } = useToast();
  const [doc, setDoc] = useState<GalleryReorderDoc | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tiles, setTiles] = useState<ReorderTile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const draggingRef = useRef(false);

  const load = useCallback(() => {
    setLoadError(null);
    setDoc(null);
    fetchGalleryReorderDoc()
      .then((loaded) => {
        setDoc(loaded);
        setTiles(
          loaded.artworks.map((raw, index) => {
            const art = toGalleryArtwork(raw, index);
            return {
              id: `art-${index}`,
              originalIndex: index,
              title: art.title,
              imageUrl: art.imageUrl,
            };
          })
        );
      })
      .catch((err: unknown) => {
        setLoadError(
          err instanceof Error ? err.message : "Couldn't load the gallery."
        );
      });
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

  // Reorder live while dragging: the masonry reflows into the exact layout
  // that will persist, so the drop spot is never a surprise.
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
      await saveGalleryOrder(doc, order);
      invalidateLiveContentCache("gallery");
      toast({ title: "Gallery order saved" });
      onSaved(
        order.map((originalIndex, index) =>
          toGalleryArtwork(doc.artworks[originalIndex], index)
        )
      );
    } catch (err) {
      toast({
        title: "Couldn't save the new order",
        description:
          err instanceof Error ? err.message : "Please try again in a moment.",
        variant: "destructive",
      });
      setSaving(false);
    }
  }, [doc, saving, tiles, toast, onSaved]);

  const handleCancel = useCallback(() => {
    if (saving) return;
    if (dirty && !window.confirm("Discard the new gallery order?")) return;
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
        Drag artwork to rearrange
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
            Back to gallery
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
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="break-inside-avoid aspect-[3/4] rounded-lg bg-muted animate-pulse"
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
          {/* Same masonry classes as the public grid, so the layout — and
              therefore the drop position — matches what visitors will see. */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 pb-20">
            {tiles.map((tile, index) => (
              <SortableArtwork
                key={tile.id}
                tile={tile}
                position={index + 1}
                jiggleAlt={index % 2 === 1}
              />
            ))}
          </div>
        </SortableContext>
        {createPortal(
          <DragOverlay adjustScale={false}>
            {activeTile ? (
              <div className="rounded-lg overflow-hidden border border-border/50 shadow-2xl ring-2 ring-[var(--ink)]/25 scale-[1.04] cursor-grabbing">
                <img
                  src={activeTile.imageUrl}
                  alt={activeTile.title}
                  className="w-full h-auto"
                  draggable={false}
                />
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

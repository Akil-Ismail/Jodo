"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SECTION_DEFS, SECTION_ORDER, renderBlock } from "@/lib/canvas/sections";
import type { Block } from "@/lib/canvas/types";
import { saveCanvas } from "@/lib/canvas/actions";

const BREAKPOINTS = { desktop: "100%", tablet: "768px", mobile: "390px" } as const;
type Breakpoint = keyof typeof BREAKPOINTS;

export function Editor({
  projectId,
  projectName,
  initialBlocks,
}: {
  projectId: string;
  projectName: string;
  initialBlocks: Block[];
}) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");
  const [activeDragType, setActiveDragType] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const selected = blocks.find((b) => b.id === selectedId) ?? null;

  function addBlock(type: string, atIndex?: number) {
    const def = SECTION_DEFS[type];
    const block: Block = { id: crypto.randomUUID(), type, props: { ...def.defaultProps } };
    setBlocks((prev) => {
      const next = [...prev];
      next.splice(atIndex ?? next.length, 0, block);
      return next;
    });
    setSelectedId(block.id);
  }

  function updateSelected(key: string, value: string) {
    if (!selected) return;
    setBlocks((prev) =>
      prev.map((b) => (b.id === selected.id ? { ...b, props: { ...b.props, [key]: value } } : b))
    );
  }

  function removeBlock(id: string) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  }

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current;
    if (data?.source === "palette") setActiveDragType(data.type as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveDragType(null);
    if (!over) return;

    const activeData = active.data.current;

    if (activeData?.source === "palette") {
      const overIndex = blocks.findIndex((b) => b.id === over.id);
      addBlock(activeData.type as string, overIndex === -1 ? blocks.length : overIndex);
      return;
    }

    if (active.id !== over.id) {
      setBlocks((prev) => {
        const oldIndex = prev.findIndex((b) => b.id === active.id);
        const newIndex = prev.findIndex((b) => b.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  function handleSave() {
    startTransition(async () => {
      await saveCanvas(projectId, projectName, blocks);
      setSavedAt(new Date());
    });
  }

  return (
    <div className="flex h-screen flex-col bg-bg text-ink">
      <TopBar
        projectName={projectName}
        breakpoint={breakpoint}
        onBreakpointChange={setBreakpoint}
        onSave={handleSave}
        isSaving={isPending}
        savedAt={savedAt}
      />

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-1 overflow-hidden">
          <Palette onAdd={(type) => addBlock(type)} />

          <div className="flex-1 overflow-auto bg-black/20 p-8">
            <div
              className="mx-auto min-h-full bg-white shadow-2xl transition-all"
              style={{ width: BREAKPOINTS[breakpoint], maxWidth: "100%" }}
            >
              <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                {blocks.length === 0 ? (
                  <EmptyDropzone />
                ) : (
                  blocks.map((block) => (
                    <CanvasBlock
                      key={block.id}
                      block={block}
                      selected={block.id === selectedId}
                      onSelect={() => setSelectedId(block.id)}
                      onRemove={() => removeBlock(block.id)}
                    />
                  ))
                )}
              </SortableContext>
            </div>
          </div>

          <Inspector selected={selected} onChange={updateSelected} />
        </div>

        <DragOverlay>
          {activeDragType ? (
            <div className="rounded-lg border border-accent bg-surface px-4 py-3 text-sm font-semibold text-ink shadow-neon-lg">
              {SECTION_DEFS[activeDragType].label}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function TopBar({
  projectName,
  breakpoint,
  onBreakpointChange,
  onSave,
  isSaving,
  savedAt,
}: {
  projectName: string;
  breakpoint: Breakpoint;
  onBreakpointChange: (b: Breakpoint) => void;
  onSave: () => void;
  isSaving: boolean;
  savedAt: Date | null;
}) {
  return (
    <header className="flex items-center justify-between border-b border-edge bg-surface px-5 py-3">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-sm text-muted transition-colors hover:text-ink">
          ← Dashboard
        </Link>
        <span className="font-display font-semibold text-ink">{projectName}</span>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-edge p-1">
        {(Object.keys(BREAKPOINTS) as Breakpoint[]).map((bp) => (
          <button
            key={bp}
            onClick={() => onBreakpointChange(bp)}
            className={
              "rounded-md px-3 py-1 text-xs capitalize transition-colors " +
              (breakpoint === bp ? "bg-neon-gradient text-white" : "text-muted hover:text-ink")
            }
          >
            {bp}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {savedAt && !isSaving && (
          <span className="text-xs text-muted">Saved {savedAt.toLocaleTimeString()}</span>
        )}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="rounded-lg bg-neon-gradient px-5 py-2 text-sm font-semibold text-white shadow-neon transition-shadow hover:shadow-neon-lg disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
    </header>
  );
}

function Palette({ onAdd }: { onAdd: (type: string) => void }) {
  return (
    <aside className="w-56 shrink-0 overflow-y-auto border-r border-edge bg-surface p-4">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Sections</h2>
      <p className="mt-1 px-1 text-xs text-muted">Drag onto the canvas, or click + to append.</p>
      <div className="mt-3 space-y-2">
        {SECTION_ORDER.map((type) => (
          <PaletteItem key={type} type={type} onAdd={() => onAdd(type)} />
        ))}
      </div>
    </aside>
  );
}

function PaletteItem({ type, onAdd }: { type: string; onAdd: () => void }) {
  const def = SECTION_DEFS[type];
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { source: "palette", type },
  });

  return (
    <div
      ref={setNodeRef}
      className={
        "flex items-center justify-between rounded-lg border border-edge bg-bg px-3 py-2.5 text-sm text-ink transition-colors hover:border-accent " +
        (isDragging ? "opacity-40" : "")
      }
    >
      <span {...listeners} {...attributes} className="flex-1 cursor-grab active:cursor-grabbing">
        {def.label}
      </span>
      <button
        onClick={onAdd}
        aria-label={`Add ${def.label}`}
        className="ml-2 rounded-md border border-edge px-2 py-0.5 text-xs text-muted hover:border-accent hover:text-accent"
      >
        +
      </button>
    </div>
  );
}

function EmptyDropzone() {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas-empty" });
  return (
    <div
      ref={setNodeRef}
      className={
        "flex h-64 items-center justify-center border-2 border-dashed text-sm transition-colors " +
        (isOver ? "border-accent text-accent" : "border-neutral-200 text-neutral-400")
      }
    >
      Drag a section here to get started
    </div>
  );
}

function CanvasBlock({
  block,
  selected,
  onSelect,
  onRemove,
}: {
  block: Block;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      onClick={onSelect}
      className={
        "group relative border-2 transition-colors " +
        (selected ? "border-accent" : "border-transparent hover:border-accent/40") +
        (isDragging ? " opacity-40" : "")
      }
    >
      {/* pointer-events-none keeps links/buttons inside the section inert while editing,
          while clicks still bubble to this wrapper's onSelect. */}
      <div className="pointer-events-none">{renderBlock(block.type, block.props)}</div>

      <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab rounded bg-neutral-900/80 px-2 py-1 text-xs text-white active:cursor-grabbing"
        >
          ⠿
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded bg-danger/90 px-2 py-1 text-xs text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Inspector({
  selected,
  onChange,
}: {
  selected: Block | null;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <aside className="w-72 shrink-0 overflow-y-auto border-l border-edge bg-surface p-4">
      <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Inspector</h2>
      {!selected ? (
        <p className="mt-3 px-1 text-sm text-muted">Select a section to edit its content.</p>
      ) : (
        <div className="mt-3 space-y-4">
          <p className="px-1 text-sm font-semibold text-ink">
            {SECTION_DEFS[selected.type].label}
          </p>
          {SECTION_DEFS[selected.type].fields.map((field) => (
            <label key={field.key} className="block">
              <span className="text-xs text-muted">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  value={selected.props[field.key] ?? ""}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-edge bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                />
              ) : field.type === "color" ? (
                <input
                  type="color"
                  value={selected.props[field.key] ?? "#000000"}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-edge bg-bg"
                />
              ) : (
                <input
                  type={field.type === "url" ? "url" : "text"}
                  value={selected.props[field.key] ?? ""}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="mt-1 w-full rounded-lg border border-edge bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                />
              )}
            </label>
          ))}
        </div>
      )}
    </aside>
  );
}

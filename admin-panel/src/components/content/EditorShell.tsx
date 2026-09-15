"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, ExternalLink, Eye, Loader2, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ContentStatus } from "@/lib/content";
import { button } from "@/lib/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDelete } from "./ConfirmDelete";

export type EditorTab = "edit" | "preview";

/**
 * Document state for a blog/event editor: tracks unsaved changes, saves
 * (create → redirect to the edit URL), deletes, ⌘S, and warns before
 * leaving with unsaved work.
 */
export function useContentDocument<T extends { status: ContentStatus; slug: string }, R extends T & { id: string }>({
  initial,
  id,
  create,
  update,
  remove,
  editHref,
  listHref,
  noun,
}: {
  initial: T;
  id?: string;
  create: (doc: T) => Promise<R>;
  update: (id: string, doc: T) => Promise<R>;
  remove: (id: string) => Promise<void>;
  editHref: (id: string) => string;
  listHref: string;
  noun: string;
}) {
  const router = useRouter();
  const [doc, setDoc] = useState<T>(initial);
  const [savedJson, setSavedJson] = useState(() => JSON.stringify(initial));
  const [saving, setSaving] = useState<ContentStatus | null>(null);
  const [savedStatus, setSavedStatus] = useState<ContentStatus>(initial.status);
  const [savedSlug, setSavedSlug] = useState(initial.slug);

  const hasUnsaved = JSON.stringify(doc) !== savedJson;

  const patch = useCallback((value: Partial<T>) => setDoc((prev) => ({ ...prev, ...value })), []);

  const save = useCallback(
    async (status: ContentStatus) => {
      if (saving) return;
      const next = { ...doc, status };
      setSaving(status);
      try {
        const result = id ? await update(id, next) : await create(next);
        // Keep the local document (the editor owns its HTML); adopt only the
        // server-normalised slug and status.
        const merged: T = { ...next, status: result.status, slug: result.slug };
        setDoc(merged);
        setSavedJson(JSON.stringify(merged));
        setSavedStatus(result.status);
        setSavedSlug(result.slug);

        const verb =
          status === "Published"
            ? savedStatus === "Published"
              ? "updated"
              : "published"
            : savedStatus === "Published"
              ? "unpublished — it's a draft again"
              : "saved as a draft";
        toast.success(`${noun} ${verb}`);

        if (!id) {
          router.replace(editHref(result.id));
        }
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Couldn't save");
      } finally {
        setSaving(null);
      }
    },
    [saving, doc, id, update, create, savedStatus, noun, router, editHref]
  );

  const destroy = useCallback(async () => {
    if (!id) return;
    try {
      await remove(id);
      setSavedJson(JSON.stringify(doc));
      toast.success(`${noun} deleted`);
      router.push(listHref);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete");
    }
  }, [id, remove, doc, noun, router, listHref]);

  // ⌘S / Ctrl+S saves without changing the status.
  const saveRef = useRef(save);
  const statusRef = useRef(savedStatus);
  useEffect(() => {
    saveRef.current = save;
    statusRef.current = savedStatus;
  }, [save, savedStatus]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveRef.current(statusRef.current);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!hasUnsaved) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsaved]);

  return { doc, patch, save, saving, savedStatus, savedSlug, hasUnsaved, destroy };
}

const STATUS_DOT = { New: "bg-gray-300", Draft: "bg-amber-400", Published: "bg-emerald-500" } as const;

/** Two-column editor body: a centred writing column and a scrolling settings panel. */
export function EditorColumns({ main, rail }: { main: React.ReactNode; rail: React.ReactNode }) {
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 px-5 pb-24 pt-10 md:px-10">
        <div className="mx-auto max-w-[720px]">{main}</div>
      </div>
      {/* 7.5rem = topbar (h-16) + editor bar (h-14). */}
      <aside className="border-t border-gray-100 bg-gray-50/40 xl:sticky xl:top-14 xl:h-[calc(100vh-7.5rem)] xl:overflow-y-auto xl:border-l xl:border-t-0">
        {rail}
      </aside>
    </div>
  );
}

export function EditorShell({
  noun,
  listHref,
  listLabel,
  title,
  isNew,
  savedStatus,
  statusNote,
  hasUnsaved,
  saving,
  liveUrl,
  publicUrl,
  tab,
  onTabChange,
  onSave,
  onDelete,
  children,
}: {
  noun: "post" | "event";
  listHref: string;
  listLabel: string;
  title: string;
  isNew: boolean;
  savedStatus: ContentStatus;
  statusNote?: string | null;
  hasUnsaved: boolean;
  saving: ContentStatus | null;
  /** Set once the item is live, for "View on website". */
  liveUrl: string | null;
  publicUrl: string;
  tab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
  onSave: (status: ContentStatus) => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const published = savedStatus === "Published";
  const status = isNew ? "New" : savedStatus;

  function leave(e: React.MouseEvent) {
    if (hasUnsaved && !window.confirm("You have unsaved changes. Leave without saving?")) {
      e.preventDefault();
    }
  }

  return (
    <div>
      <header className="sticky top-0 z-30 grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-gray-100 bg-white/90 px-3 backdrop-blur-md md:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <Link href={listHref} onClick={leave} className={button.icon} aria-label={`Back to ${listLabel}`} title={`Back to ${listLabel}`}>
            <ArrowLeft />
          </Link>
          <div className="hidden min-w-0 items-center gap-2.5 sm:flex">
            <span className="truncate text-[13px] font-medium text-gray-900">
              {title || (isNew ? `New ${noun}` : "Untitled")}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-xs text-gray-500">
              <span className={cn("size-1.5 rounded-full", STATUS_DOT[status])} />
              {(!isNew && statusNote) || status}
            </span>
            <span className="hidden shrink-0 text-xs text-gray-400 lg:inline">
              · {saving ? "Saving…" : hasUnsaved ? "Unsaved changes" : "Saved"}
            </span>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => onTabChange(v as EditorTab)}>
          <TabsList className="h-8 rounded-full bg-gray-100 p-0.5">
            <TabsTrigger value="edit" className="h-7 rounded-full border-0 px-3 text-xs font-medium text-gray-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
              <PencilLine className="size-3.5" /> Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="h-7 rounded-full border-0 px-3 text-xs font-medium text-gray-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
              <Eye className="size-3.5" /> Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex min-w-0 items-center justify-end gap-1.5">
          <button
            type="button"
            className={cn(button.ghost, "hidden h-8 md:inline-flex")}
            disabled={!!saving}
            onClick={() => onSave("Draft")}
          >
            {saving === "Draft" && <Loader2 className="animate-spin" />}
            {published ? "Unpublish" : "Save draft"}
          </button>
          <button type="button" className={cn(button.primary, "h-8 px-3.5")} disabled={!!saving} onClick={() => onSave("Published")}>
            {saving === "Published" && <Loader2 className="animate-spin" />}
            {published ? "Update" : "Publish"}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={button.icon} aria-label="More actions">
                <MoreHorizontal />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={6} className="w-52 rounded-xl p-1.5">
              <DropdownMenuItem className="rounded-lg text-[13px] md:hidden" onSelect={() => onSave("Draft")}>
                <PencilLine /> {published ? "Unpublish" : "Save draft"}
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg text-[13px]" disabled={!liveUrl} asChild={!!liveUrl}>
                {liveUrl ? (
                  <a href={liveUrl} target="_blank" rel="noreferrer">
                    <ExternalLink /> View on website
                  </a>
                ) : (
                  <span>
                    <ExternalLink /> View on website
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg text-[13px]"
                onSelect={() => {
                  navigator.clipboard.writeText(publicUrl).then(
                    () => toast.success("Link copied"),
                    () => toast.error("Couldn't copy the link")
                  );
                }}
              >
                <Copy /> Copy public link
              </DropdownMenuItem>
              {!isNew && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" className="rounded-lg text-[13px]" onSelect={() => setConfirmOpen(true)}>
                    <Trash2 /> Delete {noun}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {children}

      <ConfirmDelete
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        what={noun}
        name={title}
        published={published}
        onConfirm={onDelete}
      />
    </div>
  );
}

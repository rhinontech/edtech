"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, ExternalLink, Eye, Loader2, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ContentStatus } from "@/lib/content";
import { Button } from "@/components/ui/button";
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

function StatusPill({ status, note }: { status: ContentStatus | "New"; note?: string | null }) {
  const styles = {
    New: "bg-gray-100 border-gray-200/70 text-gray-600",
    Draft: "bg-amber-50 border-amber-200/80 text-amber-700",
    Published: "bg-emerald-50 border-emerald-200 text-emerald-700",
  }[status];

  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold", styles)}>
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", status === "Published" && "animate-pulse")} />
      {note || status}
    </span>
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
  /** Set once the item is live, for "View live". */
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

  function leave(e: React.MouseEvent) {
    if (hasUnsaved && !window.confirm("You have unsaved changes. Leave without saving?")) {
      e.preventDefault();
    }
  }

  return (
    <div className="-mx-6 -mt-6 md:-mx-8 md:-mt-8">
      {/* Negative top cancels <main>'s padding (p-6 / md:p-8), which sticky
          offsets are measured inside — so the bar sits flush under the topbar. */}
      <header className="sticky -top-6 z-30 flex h-16 md:-top-8 items-center gap-3 border-b border-gray-200/80 bg-white/90 px-4 backdrop-blur md:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href={listHref}
            onClick={leave}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200/80 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-2xs transition-colors hover:text-[#0066FF]"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            {listLabel}
          </Link>
          <div className="hidden min-w-0 items-center gap-2.5 sm:flex">
            <span className="truncate text-sm font-black tracking-tight text-gray-900">
              {title || (isNew ? `New ${noun}` : "Untitled")}
            </span>
            <StatusPill status={isNew ? "New" : savedStatus} note={isNew ? null : statusNote} />
            <span className="hidden text-xs font-medium text-gray-400 lg:inline">
              {saving ? "Saving…" : hasUnsaved ? "Unsaved changes" : "All changes saved"}
            </span>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => onTabChange(v as EditorTab)} className="shrink-0">
          <TabsList className="h-9 rounded-full bg-gray-100 p-1">
            <TabsTrigger value="edit" className="rounded-full px-3.5 text-xs font-bold">
              <PencilLine /> Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-full px-3.5 text-xs font-bold">
              <Eye /> Preview
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex shrink-0 items-center gap-2">
          {published ? (
            <Button
              variant="ghost"
              size="sm"
              className="hidden rounded-full font-bold text-gray-600 md:inline-flex"
              disabled={!!saving}
              onClick={() => onSave("Draft")}
            >
              {saving === "Draft" && <Loader2 className="animate-spin" />} Unpublish
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full font-bold"
              disabled={!!saving}
              onClick={() => onSave("Draft")}
            >
              {saving === "Draft" && <Loader2 className="animate-spin" />} Save draft
            </Button>
          )}
          <Button
            size="sm"
            className="rounded-full bg-gray-900 px-4 font-bold hover:bg-gray-800"
            disabled={!!saving}
            onClick={() => onSave("Published")}
          >
            {saving === "Published" && <Loader2 className="animate-spin" />}
            {published ? "Update" : "Publish"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 rounded-full" aria-label="More actions">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-xl">
              <DropdownMenuItem disabled={!liveUrl} asChild={!!liveUrl}>
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
                onSelect={() => {
                  navigator.clipboard.writeText(publicUrl).then(
                    () => toast.success("Link copied"),
                    () => toast.error("Couldn't copy the link")
                  );
                }}
              >
                <Copy /> Copy public link
              </DropdownMenuItem>
              {published && (
                <DropdownMenuItem className="md:hidden" onSelect={() => onSave("Draft")}>
                  <PencilLine /> Unpublish
                </DropdownMenuItem>
              )}
              {!isNew && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={() => setConfirmOpen(true)}>
                    <Trash2 /> Delete {noun}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>

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

"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { resolveAsset } from "@/lib/content";
import { contentApi } from "./api";
import { fieldClass } from "./fields";
import { Input } from "@/components/ui/input";

/** Upload (click or drop) or paste a URL. Stores the resulting URL string. */
export function ImageInput({
  value,
  onChange,
  folder,
  siteUrl,
  aspect = "aspect-[16/10]",
  emptyLabel = "Drop an image or click to upload",
  compact = false,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: "blogs" | "events";
  siteUrl: string;
  aspect?: string;
  emptyLabel?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function upload(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("That file isn't an image");
      return;
    }
    setUploading(true);
    try {
      onChange(await contentApi.uploadImage(file, folder));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const preview = resolveAsset(value, siteUrl);

  return (
    <div className="space-y-2.5">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          upload(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "group relative w-full cursor-pointer overflow-hidden rounded-lg border transition-all outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500/15",
          compact ? "size-16 rounded-full" : aspect,
          preview ? "border-gray-200/70" : "border-dashed border-gray-200 bg-gray-50/60 hover:border-gray-300 hover:bg-gray-50",
          dragging && "border-indigo-400 bg-indigo-50/50"
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 px-3 text-center">
            <ImagePlus className="size-4 text-gray-400" strokeWidth={1.75} />
            {!compact && <span className="text-xs text-gray-500">{emptyLabel}</span>}
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <Loader2 className="size-4 animate-spin text-gray-600" />
          </div>
        )}

        {preview && !uploading && (
          <>
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950/0 opacity-0 transition-all group-hover:bg-gray-950/30 group-hover:opacity-100">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-900 shadow-sm">
                <Upload className="size-3" /> {compact ? "" : "Replace"}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className={cn(
                "absolute rounded-full bg-gray-950/60 p-1 text-white opacity-0 transition hover:bg-rose-600 group-hover:opacity-100",
                compact ? "right-0 top-0" : "right-2 top-2"
              )}
              title="Remove image"
            >
              <X className="size-3.5" />
            </button>
          </>
        )}
      </div>

      {!compact && (
        <Input
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="or paste an image URL"
          className={cn(fieldClass, "h-8 text-xs")}
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => upload(e.target.files?.[0])}
      />
    </div>
  );
}

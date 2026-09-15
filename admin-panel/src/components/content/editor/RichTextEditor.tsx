"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import Image from "@tiptap/extension-image";
import {
  TbAlignCenter,
  TbAlignJustified,
  TbAlignLeft,
  TbAlignRight,
  TbBlockquote,
  TbBold,
  TbBrandYoutube,
  TbClearFormatting,
  TbCode,
  TbColumnInsertRight,
  TbColumnRemove,
  TbHighlight,
  TbIndentDecrease,
  TbIndentIncrease,
  TbItalic,
  TbLetterA,
  TbLink,
  TbLinkOff,
  TbList,
  TbListNumbers,
  TbLoader,
  TbPhoto,
  TbRowInsertBottom,
  TbRowRemove,
  TbSourceCode,
  TbStrikethrough,
  TbSubscript,
  TbSuperscript,
  TbTable,
  TbTableOff,
  TbTrash,
  TbUnderline,
  TbUpload,
  TbVideo,
} from "react-icons/tb";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { contentApi } from "../api";
import { VideoEmbed, extractYouTubeId } from "./videoNode";

// Ported from rhinon-cms' BlogEditor/ParagraphBlock. The editing surface
// carries the `uc-article` styles, so what you type is typeset exactly as
// the landing site's article body.

type Attrs = Record<string, string | null | undefined>;

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element: HTMLElement) => element.style.width || element.getAttribute("width") || "100%",
        renderHTML: (attributes: Attrs) => ({
          style: `width: ${attributes.width}; max-width: 100%; height: auto;`,
          width: attributes.width,
        }),
      },
      align: {
        default: "center",
        parseHTML: (element: HTMLElement) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes: Attrs) => {
          const margins =
            attributes.align === "left"
              ? "margin-right: auto; margin-left: 0;"
              : attributes.align === "right"
                ? "margin-left: auto; margin-right: 0;"
                : "margin-left: auto; margin-right: auto;";
          return { "data-align": attributes.align, style: `display: block; ${margins}` };
        },
      },
    };
  },
});

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Blue", value: "#0066FF" },
  { label: "Indigo", value: "#4f46e5" },
  { label: "Emerald", value: "#059669" },
  { label: "Amber", value: "#d97706" },
  { label: "Rose", value: "#e11d48" },
  { label: "Gray", value: "#6b7280" },
];

const HIGHLIGHT_COLORS = [
  { label: "None", value: "" },
  { label: "Yellow", value: "#fef08a" },
  { label: "Blue", value: "#dbeafe" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Pink", value: "#fbcfe8" },
  { label: "Orange", value: "#fed7aa" },
];

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        "rounded-lg p-1.5 transition-colors",
        active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-4 w-px shrink-0 bg-gray-200" />;
}

const popoverInput =
  "h-8 min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-2.5 text-xs text-gray-900 outline-none focus:border-[#0066FF] focus:bg-white";
const popoverSubmit =
  "h-8 rounded-lg bg-gray-900 px-3 text-xs font-bold text-white hover:bg-gray-800 disabled:opacity-50";

function PopoverToolButton({
  title,
  icon,
  active,
  open,
  onOpenChange,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={title}
          aria-label={title}
          onMouseDown={(e) => e.preventDefault()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
            open && !active && "bg-gray-100 text-gray-900"
          )}
        >
          {icon}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 rounded-2xl p-3">
        {children}
      </PopoverContent>
    </Popover>
  );
}

function LinkButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [newTab, setNewTab] = useState(false);

  function handleOpen(next: boolean) {
    if (next) {
      const attrs = editor.getAttributes("link");
      setUrl((attrs.href as string) || "");
      setNewTab(attrs.target === "_blank");
    }
    setOpen(next);
  }

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const href = url.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (!href) chain.unsetLink().run();
    else chain.setLink({ href, target: newTab ? "_blank" : null }).run();
    setOpen(false);
  }

  return (
    <PopoverToolButton
      title="Link"
      icon={<TbLink size={16} />}
      active={editor.isActive("link")}
      open={open}
      onOpenChange={handleOpen}
    >
      <form onSubmit={apply} className="space-y-2.5">
        <h4 className="text-xs font-bold text-gray-900">Link</h4>
        <div className="flex gap-1.5">
          <input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… or /events"
            className={popoverInput}
          />
          <button type="submit" className={popoverSubmit}>
            {url.trim() ? "Apply" : "Remove"}
          </button>
        </div>
        <label className="flex items-center gap-2 text-xs font-medium text-gray-600">
          <input type="checkbox" checked={newTab} onChange={(e) => setNewTab(e.target.checked)} />
          Open in a new tab
        </label>
      </form>
    </PopoverToolButton>
  );
}

function InsertImageButton({ editor, folder }: { editor: Editor; folder: "blogs" | "events" }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await contentApi.uploadImage(file, folder);
      editor.chain().focus().setImage({ src: uploaded }).run();
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    editor.chain().focus().setImage({ src: url.trim() }).run();
    setUrl("");
    setOpen(false);
  }

  return (
    <PopoverToolButton title="Insert image" icon={<TbPhoto size={16} />} open={open} onOpenChange={setOpen}>
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold text-gray-900">Insert image</h4>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? <TbLoader size={15} className="animate-spin" /> : <TbUpload size={15} />}
          {uploading ? "Uploading…" : "Upload from computer"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <div className="relative flex items-center py-1">
          <span className="absolute inset-x-0 h-px bg-gray-100" />
          <span className="relative mx-auto bg-white px-2 text-[10px] font-bold text-gray-400">OR</span>
        </div>
        <form onSubmit={handleUrl} className="flex gap-1.5">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste image URL…" className={popoverInput} />
          <button type="submit" disabled={!url.trim()} className={popoverSubmit}>
            Insert
          </button>
        </form>
      </div>
    </PopoverToolButton>
  );
}

function InsertVideoButton({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  function handleUrl(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    const kind = extractYouTubeId(trimmed) ? "youtube" : "file";
    editor.chain().focus().setVideoEmbed({ src: trimmed, kind }).run();
    setUrl("");
    setOpen(false);
  }

  return (
    <PopoverToolButton title="Embed video" icon={<TbVideo size={16} />} open={open} onOpenChange={setOpen}>
      <form onSubmit={handleUrl} className="space-y-2.5">
        <h4 className="text-xs font-bold text-gray-900">Embed video</h4>
        <div className="flex gap-1.5">
          <input
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="YouTube link or .mp4 URL"
            className={popoverInput}
          />
          <button type="submit" disabled={!url.trim()} className={popoverSubmit}>
            Embed
          </button>
        </div>
        <p className="flex items-center gap-1 text-[11px] font-medium text-gray-400">
          <TbBrandYoutube size={13} /> YouTube links embed in privacy mode.
        </p>
      </form>
    </PopoverToolButton>
  );
}

function ColorMenu({
  title,
  icon,
  active,
  colors,
  onPick,
}: {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  colors: { label: string; value: string }[];
  onPick: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={title}
          aria-label={title}
          onMouseDown={(e) => e.preventDefault()}
          className={cn(
            "rounded-lg p-1.5 transition-colors",
            active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          {icon}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[140px]">
        {colors.map((c) => (
          <DropdownMenuItem key={c.label} onSelect={() => onPick(c.value)} className="gap-2.5">
            <span className="h-3.5 w-3.5 rounded-full border border-gray-200" style={{ background: c.value || "#ffffff" }} />
            {c.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RichTextEditor({
  initialHtml,
  onChange,
  placeholder = "Start writing…",
  folder,
  minHeight = "min-h-[50vh]",
  toolbarOffset = "top-10 md:top-8",
}: {
  /** Read once on mount; the editor owns the document afterwards. */
  initialHtml: string;
  onChange: (html: string) => void;
  placeholder?: string;
  folder: "blogs" | "events";
  minHeight?: string;
  /** Sticky offset for the toolbar: just below the EditorShell header (h-16 minus <main>'s padding). */
  toolbarOffset?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true, // toolbar active-states track the cursor
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        horizontalRule: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Placeholder.configure({ placeholder }),
      TextStyleKit,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TableKit.configure({ table: { resizable: false } }),
      CustomImage,
      VideoEmbed,
    ],
    content: initialHtml || "",
    editorProps: {
      attributes: { class: cn("uc-article px-6 py-6 sm:px-10 sm:py-8", minHeight) },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  if (!editor) {
    return <div className={cn("rounded-3xl border border-gray-200/80 bg-gray-50 animate-pulse", minHeight)} />;
  }

  const styleValue = editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
      ? "h3"
      : editor.isActive("heading", { level: 4 })
        ? "h4"
        : "p";
  const inTable = editor.isActive("table");
  const imageAttrs = editor.getAttributes("image");
  const videoAttrs = editor.getAttributes("videoEmbed");

  const sizeButton = (active: boolean) =>
    cn(
      "rounded-md border px-2 py-0.5 text-[11px] font-bold transition-all",
      active ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
    );

  return (
    <div className="rounded-3xl border border-gray-200/80 bg-white shadow-sm">
      <div className={cn("sticky z-20 rounded-t-3xl border-b border-gray-100 bg-white/95 backdrop-blur", toolbarOffset)}>
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2">
          <select
            title="Paragraph style"
            value={styleValue}
            onChange={(e) => {
              const v = e.target.value;
              const chain = editor.chain().focus();
              if (v === "p") chain.setParagraph().run();
              else chain.toggleHeading({ level: Number(v.slice(1)) as 2 | 3 | 4 }).run();
            }}
            className="h-8 rounded-lg border border-gray-200 bg-gray-50 px-2 text-xs font-bold text-gray-700 outline-none focus:border-[#0066FF]"
          >
            <option value="p">Paragraph</option>
            <option value="h2">Heading (in contents)</option>
            <option value="h3">Subheading</option>
            <option value="h4">Small heading</option>
          </select>

          <Divider />

          <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <TbBold size={16} />
          </ToolbarButton>
          <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <TbItalic size={16} />
          </ToolbarButton>
          <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <TbUnderline size={16} />
          </ToolbarButton>
          <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <TbStrikethrough size={16} />
          </ToolbarButton>

          <Divider />

          <ColorMenu
            title="Text colour"
            icon={<TbLetterA size={16} />}
            colors={TEXT_COLORS}
            onPick={(value) =>
              value ? editor.chain().focus().setColor(value).run() : editor.chain().focus().unsetColor().run()
            }
          />
          <ColorMenu
            title="Highlight"
            icon={<TbHighlight size={16} />}
            active={editor.isActive("highlight")}
            colors={HIGHLIGHT_COLORS}
            onPick={(value) =>
              value
                ? editor.chain().focus().setHighlight({ color: value }).run()
                : editor.chain().focus().unsetHighlight().run()
            }
          />
          <ToolbarButton title="Subscript" active={editor.isActive("subscript")} onClick={() => editor.chain().focus().toggleSubscript().run()}>
            <TbSubscript size={16} />
          </ToolbarButton>
          <ToolbarButton title="Superscript" active={editor.isActive("superscript")} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
            <TbSuperscript size={16} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton title="Checklist (bullets)" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <TbList size={16} />
          </ToolbarButton>
          <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <TbListNumbers size={16} />
          </ToolbarButton>
          <ToolbarButton title="Decrease indent" onClick={() => editor.chain().focus().liftListItem("listItem").run()}>
            <TbIndentDecrease size={16} />
          </ToolbarButton>
          <ToolbarButton title="Increase indent" onClick={() => editor.chain().focus().sinkListItem("listItem").run()}>
            <TbIndentIncrease size={16} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
            <TbAlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton title="Align centre" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
            <TbAlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
            <TbAlignRight size={16} />
          </ToolbarButton>
          <ToolbarButton title="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
            <TbAlignJustified size={16} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton title="Pull quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <TbBlockquote size={16} />
          </ToolbarButton>
          <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            <TbCode size={16} />
          </ToolbarButton>
          <ToolbarButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <TbSourceCode size={16} />
          </ToolbarButton>

          <Divider />

          <LinkButton editor={editor} />
          {editor.isActive("link") && (
            <ToolbarButton title="Remove link" onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}>
              <TbLinkOff size={16} />
            </ToolbarButton>
          )}
          <InsertImageButton editor={editor} folder={folder} />
          <InsertVideoButton editor={editor} />
          <ToolbarButton
            title="Insert table"
            active={inTable}
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          >
            <TbTable size={16} />
          </ToolbarButton>

          <Divider />

          <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
            <TbClearFormatting size={16} />
          </ToolbarButton>
        </div>

        {inTable && (
          <div className="flex flex-wrap items-center gap-0.5 border-t border-gray-100 bg-gray-50/80 px-3 py-1">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Table</span>
            <ToolbarButton title="Add row below" onClick={() => editor.chain().focus().addRowAfter().run()}>
              <TbRowInsertBottom size={15} />
            </ToolbarButton>
            <ToolbarButton title="Add column right" onClick={() => editor.chain().focus().addColumnAfter().run()}>
              <TbColumnInsertRight size={15} />
            </ToolbarButton>
            <ToolbarButton title="Delete row" onClick={() => editor.chain().focus().deleteRow().run()}>
              <TbRowRemove size={15} />
            </ToolbarButton>
            <ToolbarButton title="Delete column" onClick={() => editor.chain().focus().deleteColumn().run()}>
              <TbColumnRemove size={15} />
            </ToolbarButton>
            <ToolbarButton title="Delete table" onClick={() => editor.chain().focus().deleteTable().run()}>
              <TbTableOff size={15} />
            </ToolbarButton>
          </div>
        )}

        {editor.isActive("image") && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 bg-gray-50/80 px-3 py-1.5">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Image</span>
            <ToolbarButton title="Align left" active={imageAttrs.align === "left"} onClick={() => editor.chain().focus().updateAttributes("image", { align: "left" }).run()}>
              <TbAlignLeft size={15} />
            </ToolbarButton>
            <ToolbarButton title="Align centre" active={!imageAttrs.align || imageAttrs.align === "center"} onClick={() => editor.chain().focus().updateAttributes("image", { align: "center" }).run()}>
              <TbAlignCenter size={15} />
            </ToolbarButton>
            <ToolbarButton title="Align right" active={imageAttrs.align === "right"} onClick={() => editor.chain().focus().updateAttributes("image", { align: "right" }).run()}>
              <TbAlignRight size={15} />
            </ToolbarButton>
            <Divider />
            {(["25%", "50%", "75%", "100%"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => editor.chain().focus().updateAttributes("image", { width: size }).run()}
                className={sizeButton(imageAttrs.width === size)}
              >
                {size}
              </button>
            ))}
            <Divider />
            <input
              type="text"
              placeholder="Alt text (describe the image)"
              value={(imageAttrs.alt as string) || ""}
              onChange={(e) => editor.chain().updateAttributes("image", { alt: e.target.value }).run()}
              className="h-7 min-w-[200px] flex-1 rounded-lg border border-gray-200 bg-white px-2 text-[11px] text-gray-900 outline-none focus:border-[#0066FF]"
            />
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteSelection().run()}
              className="rounded-lg p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
              title="Delete image"
            >
              <TbTrash size={15} />
            </button>
          </div>
        )}

        {editor.isActive("videoEmbed") && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 bg-gray-50/80 px-3 py-1.5">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {videoAttrs.kind === "youtube" ? "YouTube" : "Video"}
            </span>
            {(["50%", "75%", "100%"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => editor.chain().focus().updateAttributes("videoEmbed", { width: size }).run()}
                className={sizeButton(videoAttrs.width === size)}
              >
                {size}
              </button>
            ))}
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteSelection().run()}
              className="rounded-lg p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
              title="Delete video"
            >
              <TbTrash size={15} />
            </button>
          </div>
        )}
      </div>

      <EditorContent editor={editor} className="uc-site" />
    </div>
  );
}

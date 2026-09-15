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
  TbCheck,
  TbClearFormatting,
  TbCode,
  TbDots,
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
  DropdownMenuSeparator,
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
        "flex size-7 items-center justify-center rounded-md transition-colors",
        active ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-4 w-px shrink-0 bg-gray-100" />;
}

const popoverInput =
  "h-8 min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-gray-900 outline-none focus:border-gray-300 focus:ring-[3px] focus:ring-indigo-500/15";
const popoverSubmit =
  "h-8 rounded-full bg-gray-900 px-3 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50";

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
            "flex size-7 items-center justify-center rounded-md transition-colors",
            active || open ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          {icon}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} className="w-80 rounded-xl border-gray-200/70 p-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]">
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
        <h4 className="text-xs font-semibold text-gray-900">Link</h4>
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
        <h4 className="text-xs font-semibold text-gray-900">Insert image</h4>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 text-[13px] font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {uploading ? <TbLoader size={15} className="animate-spin" /> : <TbUpload size={15} />}
          {uploading ? "Uploading…" : "Upload from computer"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <div className="relative flex items-center py-1">
          <span className="absolute inset-x-0 h-px bg-gray-100" />
          <span className="relative mx-auto bg-white px-2 text-[10px] font-medium text-gray-400">OR</span>
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
        <h4 className="text-xs font-semibold text-gray-900">Embed video</h4>
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
        <p className="flex items-center gap-1 text-[11px] text-gray-400">
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
            "flex size-7 items-center justify-center rounded-md transition-colors",
            active ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          {icon}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[140px] rounded-xl p-1.5">
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

function IconMenu({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: { label: string; icon: React.ReactNode; active?: boolean; separated?: boolean; onSelect: () => void }[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          title={title}
          aria-label={title}
          onMouseDown={(e) => e.preventDefault()}
          className="flex size-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900"
        >
          {icon}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44 rounded-xl p-1.5">
        {items.map((item) => (
          <div key={item.label}>
            {item.separated && <DropdownMenuSeparator />}
            <DropdownMenuItem onSelect={item.onSelect} className="gap-2.5 rounded-lg text-[13px]">
              <span className="text-gray-400 [&_svg]:size-4">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.active && <TbCheck className="size-3.5! text-gray-900!" />}
            </DropdownMenuItem>
          </div>
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
  toolbarOffset = "top-14",
}: {
  /** Read once on mount; the editor owns the document afterwards. */
  initialHtml: string;
  onChange: (html: string) => void;
  placeholder?: string;
  folder: "blogs" | "events";
  minHeight?: string;
  /** Sticky offset for the toolbar: just below the EditorShell bar (h-14). */
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
      attributes: { class: cn("uc-article py-6", minHeight) },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  if (!editor) {
    return <div className={cn("rounded-lg bg-gray-50 animate-pulse", minHeight)} />;
  }

  const styleValue = editor.isActive("heading", { level: 2 })
    ? "h2"
    : editor.isActive("heading", { level: 3 })
      ? "h3"
      : editor.isActive("heading", { level: 4 })
        ? "h4"
        : "p";
  const inTable = editor.isActive("table");
  const AlignIcon = editor.isActive({ textAlign: "center" })
    ? TbAlignCenter
    : editor.isActive({ textAlign: "right" })
      ? TbAlignRight
      : editor.isActive({ textAlign: "justify" })
        ? TbAlignJustified
        : TbAlignLeft;
  const imageAttrs = editor.getAttributes("image");
  const videoAttrs = editor.getAttributes("videoEmbed");

  const sizeButton = (active: boolean) =>
    cn(
      "rounded-md px-2 py-0.5 text-[11px] font-medium transition-all",
      active ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
    );

  return (
    <div>
      <div className={cn("sticky z-20 -mx-2 border-b border-gray-100 bg-white/90 backdrop-blur-md", toolbarOffset)}>
        <div className="flex flex-wrap items-center gap-0.5 px-1 py-1.5">
          <select
            title="Paragraph style"
            value={styleValue}
            onChange={(e) => {
              const v = e.target.value;
              const chain = editor.chain().focus();
              if (v === "p") chain.setParagraph().run();
              else chain.toggleHeading({ level: Number(v.slice(1)) as 2 | 3 | 4 }).run();
            }}
            className="h-7 rounded-md border-0 bg-transparent px-1.5 text-xs font-medium text-gray-600 outline-none hover:bg-gray-100 focus:ring-[3px] focus:ring-indigo-500/15"
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
          <Divider />

          <ToolbarButton title="Checklist (bullets)" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <TbList size={16} />
          </ToolbarButton>
          <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <TbListNumbers size={16} />
          </ToolbarButton>
          <IconMenu
            title="Alignment"
            icon={<AlignIcon size={16} />}
            items={[
              { label: "Align left", icon: <TbAlignLeft />, active: editor.isActive({ textAlign: "left" }), onSelect: () => editor.chain().focus().setTextAlign("left").run() },
              { label: "Align centre", icon: <TbAlignCenter />, active: editor.isActive({ textAlign: "center" }), onSelect: () => editor.chain().focus().setTextAlign("center").run() },
              { label: "Align right", icon: <TbAlignRight />, active: editor.isActive({ textAlign: "right" }), onSelect: () => editor.chain().focus().setTextAlign("right").run() },
              { label: "Justify", icon: <TbAlignJustified />, active: editor.isActive({ textAlign: "justify" }), onSelect: () => editor.chain().focus().setTextAlign("justify").run() },
            ]}
          />

          <Divider />

          <ToolbarButton title="Pull quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <TbBlockquote size={16} />
          </ToolbarButton>
          <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
            <TbCode size={16} />
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

          {/* Less-used tools stay one click away so the bar fits on one row. */}
          <IconMenu
            title="More formatting"
            icon={<TbDots size={16} />}
            items={[
              { label: "Subscript", icon: <TbSubscript />, active: editor.isActive("subscript"), onSelect: () => editor.chain().focus().toggleSubscript().run() },
              { label: "Superscript", icon: <TbSuperscript />, active: editor.isActive("superscript"), onSelect: () => editor.chain().focus().toggleSuperscript().run() },
              { label: "Code block", icon: <TbSourceCode />, active: editor.isActive("codeBlock"), onSelect: () => editor.chain().focus().toggleCodeBlock().run() },
              { label: "Increase indent", icon: <TbIndentIncrease />, onSelect: () => editor.chain().focus().sinkListItem("listItem").run() },
              { label: "Decrease indent", icon: <TbIndentDecrease />, onSelect: () => editor.chain().focus().liftListItem("listItem").run() },
              { label: "Clear formatting", icon: <TbClearFormatting />, separated: true, onSelect: () => editor.chain().focus().unsetAllMarks().clearNodes().run() },
            ]}
          />
        </div>

        {inTable && (
          <div className="flex flex-wrap items-center gap-0.5 border-t border-gray-100 px-1 py-1">
            <span className="mr-1 px-1 text-[11px] font-medium text-gray-400">Table</span>
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
          <div className="flex flex-wrap items-center gap-1 border-t border-gray-100 px-1 py-1">
            <span className="mr-1 px-1 text-[11px] font-medium text-gray-400">Image</span>
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
              className="h-7 min-w-[200px] flex-1 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-900 outline-none focus:border-gray-300"
            />
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteSelection().run()}
              className="flex size-7 items-center justify-center rounded-md text-gray-400 hover:bg-rose-50 hover:text-rose-600"
              title="Delete image"
            >
              <TbTrash size={15} />
            </button>
          </div>
        )}

        {editor.isActive("videoEmbed") && (
          <div className="flex flex-wrap items-center gap-1 border-t border-gray-100 px-1 py-1">
            <span className="mr-1 px-1 text-[11px] font-medium text-gray-400">
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
              className="flex size-7 items-center justify-center rounded-md text-gray-400 hover:bg-rose-50 hover:text-rose-600"
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

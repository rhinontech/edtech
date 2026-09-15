"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Braces, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { button } from "@/lib/ui";
import type { AgendaSlot, Faq } from "@/lib/content";
import { Textarea } from "@/components/ui/textarea";
import { textareaClass } from "./fields";

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Reorder/remove controls that appear on row hover or focus. */
function RowActions({
  index,
  length,
  onMove,
  onRemove,
}: {
  index: number;
  length: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  const btn =
    "flex size-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className="flex shrink-0 items-center opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
      <button type="button" className={btn} disabled={index === 0} onClick={() => onMove(index - 1)} aria-label="Move up">
        <ArrowUp className="size-3.5" />
      </button>
      <button type="button" className={btn} disabled={index === length - 1} onClick={() => onMove(index + 1)} aria-label="Move down">
        <ArrowDown className="size-3.5" />
      </button>
      <button type="button" className={cn(btn, "hover:bg-rose-50 hover:text-rose-600")} onClick={onRemove} aria-label="Remove">
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function AddRow({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 items-center gap-2 px-3 text-[13px] text-gray-400 transition-colors hover:text-gray-900"
    >
      <Plus className="size-3.5" /> {label}
    </button>
  );
}

const listFrame = "rounded-lg border border-gray-200/70 bg-white";

/** Simple one-line rows. Enter adds a row below; Backspace on an empty row removes it. */
export function BulletListEditor({
  items,
  onChange,
  placeholder,
  addLabel = "Add item",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  addLabel?: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function focus(index: number) {
    requestAnimationFrame(() => refs.current[index]?.focus());
  }

  return (
    <div className={listFrame}>
      <div className="divide-y divide-gray-100">
        {items.map((item, index) => (
          <div key={index} className="group flex items-center gap-3 pl-3 pr-1.5">
            <span className="size-1.5 shrink-0 rounded-full bg-gray-300" />
            <input
              ref={(el) => {
                refs.current[index] = el;
              }}
              value={item}
              onChange={(e) => onChange(items.map((v, i) => (i === index ? e.target.value : v)))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onChange([...items.slice(0, index + 1), "", ...items.slice(index + 1)]);
                  focus(index + 1);
                } else if (e.key === "Backspace" && !item) {
                  e.preventDefault();
                  onChange(items.filter((_, i) => i !== index));
                  focus(Math.max(0, index - 1));
                }
              }}
              placeholder={placeholder}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            <RowActions
              index={index}
              length={items.length}
              onMove={(to) => onChange(move(items, index, to))}
              onRemove={() => onChange(items.filter((_, i) => i !== index))}
            />
          </div>
        ))}
      </div>
      <div className={cn(items.length > 0 && "border-t border-gray-100")}>
        <AddRow
          label={addLabel}
          onClick={() => {
            onChange([...items, ""]);
            focus(items.length);
          }}
        />
      </div>
    </div>
  );
}

/** Small tag chips, e.g. post tags or instructor highlights. */
export function ChipListEditor({
  items,
  onChange,
  placeholder,
  max = 8,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  max?: number;
}) {
  const [draft, setDraft] = useState("");

  function commit() {
    const value = draft.trim();
    if (!value || items.includes(value) || items.length >= max) return;
    onChange([...items, value]);
    setDraft("");
  }

  return (
    <div className="flex min-h-9 flex-wrap items-center gap-1 rounded-lg border border-gray-200 bg-white px-1.5 py-1 transition focus-within:border-gray-300 focus-within:ring-[3px] focus-within:ring-indigo-500/15">
      {items.map((item) => (
        <span key={item} className="inline-flex h-6 items-center gap-1 rounded-md bg-gray-100 pl-2 pr-1 text-xs text-gray-700">
          {item}
          <button
            type="button"
            onClick={() => onChange(items.filter((v) => v !== item))}
            className="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-900"
            aria-label={`Remove ${item}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
      {items.length < max && (
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && !draft && items.length) {
              onChange(items.slice(0, -1));
            }
          }}
          onBlur={commit}
          placeholder={items.length ? "" : placeholder}
          className="h-6 min-w-24 flex-1 bg-transparent px-1.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      )}
    </div>
  );
}

/** Time + description rows. */
export function AgendaEditor({ slots, onChange }: { slots: AgendaSlot[]; onChange: (slots: AgendaSlot[]) => void }) {
  const patch = (index: number, value: Partial<AgendaSlot>) =>
    onChange(slots.map((slot, i) => (i === index ? { ...slot, ...value } : slot)));

  return (
    <div className={listFrame}>
      <div className="divide-y divide-gray-100">
        {slots.map((slot, index) => (
          <div key={index} className="group flex items-center pr-1.5">
            <input
              value={slot.time}
              onChange={(e) => patch(index, { time: e.target.value })}
              placeholder="6:00 PM"
              aria-label="Time"
              className="h-10 w-28 shrink-0 border-r border-gray-100 bg-transparent px-3 text-[13px] font-medium text-gray-900 tabular-nums outline-none placeholder:font-normal placeholder:text-gray-400"
            />
            <input
              value={slot.item}
              onChange={(e) => patch(index, { item: e.target.value })}
              placeholder="What happens in this slot"
              aria-label="Agenda item"
              className="h-10 min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
            />
            <RowActions
              index={index}
              length={slots.length}
              onMove={(to) => onChange(move(slots, index, to))}
              onRemove={() => onChange(slots.filter((_, i) => i !== index))}
            />
          </div>
        ))}
      </div>
      <div className={cn(slots.length > 0 && "border-t border-gray-100")}>
        <AddRow label="Add slot" onClick={() => onChange([...slots, { time: "", item: "" }])} />
      </div>
    </div>
  );
}

/**
 * Accepts a plain [{question, answer}] array (q/a also work) or a full
 * schema.org FAQPage object — same formats as the rhinon-cms importer.
 */
function parseFaqJson(raw: string): Faq[] {
  const data = JSON.parse(raw);
  const source: unknown[] = Array.isArray(data) ? data : Array.isArray(data?.mainEntity) ? data.mainEntity : [];
  const items = source
    .map((entry) => {
      const item = (entry ?? {}) as Record<string, unknown>;
      const accepted = item.acceptedAnswer as Record<string, unknown> | string | undefined;
      return {
        question: String(item.question ?? item.q ?? item.name ?? "").trim(),
        answer: String(item.answer ?? item.a ?? (typeof accepted === "object" ? accepted?.text : accepted) ?? "").trim(),
      };
    })
    .filter((faq) => faq.question && faq.answer);
  if (!items.length) throw new Error("No FAQs found in that JSON");
  return items;
}

export function FaqJsonButton({ faqs, onChange }: { faqs: Faq[]; onChange: (faqs: Faq[]) => void }) {
  const [open, setOpen] = useState(false);
  const [json, setJson] = useState("");

  function importJson() {
    try {
      const items = parseFaqJson(json);
      onChange([...faqs.filter((f) => f.question.trim() || f.answer.trim()), ...items]);
      toast.success(`Imported ${items.length} FAQ${items.length === 1 ? "" : "s"}`);
      setJson("");
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error && err.message.startsWith("No FAQs") ? err.message : "That isn't valid JSON");
    }
  }

  return (
    <div className="relative">
      <button type="button" className={cn(button.ghost, "h-8 px-2.5 text-xs")} onClick={() => setOpen((v) => !v)}>
        <Braces className="size-3.5!" /> Import JSON
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-80 space-y-2 rounded-xl border border-gray-200/70 bg-white p-3 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.18)]">
          <p className="text-xs text-gray-500">
            Paste <code className="rounded bg-gray-100 px-1">[{`{"question","answer"}`}]</code> or an FAQPage schema.
          </p>
          <Textarea
            autoFocus
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className={cn(textareaClass, "min-h-32 font-mono text-xs")}
            placeholder={'[\n  { "question": "…", "answer": "…" }\n]'}
          />
          <div className="flex justify-end gap-1">
            <button type="button" className={cn(button.ghost, "h-8 text-xs")} onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="button" className={cn(button.primary, "h-8 px-3 text-xs")} disabled={!json.trim()} onClick={importJson}>
              Import
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FaqEditor({ faqs, onChange }: { faqs: Faq[]; onChange: (faqs: Faq[]) => void }) {
  const patch = (index: number, value: Partial<Faq>) =>
    onChange(faqs.map((faq, i) => (i === index ? { ...faq, ...value } : faq)));

  return (
    <div className={listFrame}>
      <div className="divide-y divide-gray-100">
        {faqs.map((faq, index) => (
          <div key={index} className="group px-3 py-2">
            <div className="flex items-center gap-2">
              <input
                value={faq.question}
                onChange={(e) => patch(index, { question: e.target.value })}
                placeholder={`Question ${index + 1}`}
                aria-label={`Question ${index + 1}`}
                className="h-8 min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:font-normal placeholder:text-gray-400"
              />
              <RowActions
                index={index}
                length={faqs.length}
                onMove={(to) => onChange(move(faqs, index, to))}
                onRemove={() => onChange(faqs.filter((_, i) => i !== index))}
              />
            </div>
            <textarea
              value={faq.answer}
              onChange={(e) => patch(index, { answer: e.target.value })}
              placeholder="Answer"
              aria-label={`Answer ${index + 1}`}
              rows={2}
              className="field-sizing-content w-full resize-none bg-transparent pb-1 text-sm leading-relaxed text-gray-600 outline-none placeholder:text-gray-400"
            />
          </div>
        ))}
      </div>
      <div className={cn(faqs.length > 0 && "border-t border-gray-100")}>
        <AddRow label="Add question" onClick={() => onChange([...faqs, { question: "", answer: "" }])} />
      </div>
    </div>
  );
}

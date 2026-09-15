"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Braces, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { AgendaSlot, Faq } from "@/lib/content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fieldClass, textareaClass } from "./fields";

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

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
  const btn = "rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div className="flex shrink-0 items-center">
      <button type="button" className={btn} disabled={index === 0} onClick={() => onMove(index - 1)} title="Move up">
        <ArrowUp className="size-3.5" />
      </button>
      <button type="button" className={btn} disabled={index === length - 1} onClick={() => onMove(index + 1)} title="Move down">
        <ArrowDown className="size-3.5" />
      </button>
      <button type="button" className={cn(btn, "hover:bg-rose-50 hover:text-rose-600")} onClick={onRemove} title="Remove">
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

function AddRowButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed border-gray-300 py-2.5 text-xs font-bold text-gray-500 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900"
    >
      <Plus className="size-3.5" /> {label}
    </button>
  );
}

/**
 * Bullet rows styled like the event page's takeaway cards. Enter adds a row
 * below; Backspace on an empty row removes it.
 */
export function BulletListEditor({
  items,
  onChange,
  placeholder,
  addLabel = "Add item",
  bullet = "✓",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  addLabel?: string;
  bullet?: string;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function focus(index: number) {
    requestAnimationFrame(() => refs.current[index]?.focus());
  }

  return (
    <div className="space-y-2.5">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#F8FAFC] py-1.5 pl-3.5 pr-1.5 transition-colors focus-within:border-blue-200"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0066FF] text-xs font-black text-white">
            {bullet}
          </span>
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
              } else if (e.key === "Backspace" && !item && items.length > 0) {
                e.preventDefault();
                onChange(items.filter((_, i) => i !== index));
                focus(Math.max(0, index - 1));
              }
            }}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-gray-800 outline-none placeholder:font-medium placeholder:text-gray-400"
          />
          <RowActions
            index={index}
            length={items.length}
            onMove={(to) => onChange(move(items, index, to))}
            onRemove={() => onChange(items.filter((_, i) => i !== index))}
          />
        </div>
      ))}
      <AddRowButton
        label={addLabel}
        onClick={() => {
          onChange([...items, ""]);
          focus(items.length);
        }}
      />
    </div>
  );
}

/** Small pill chips, e.g. instructor highlights ("Ex-Tech Lead"). */
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
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-2 py-1.5 focus-within:border-[#0066FF] focus-within:bg-white focus-within:ring-3 focus-within:ring-blue-100">
      {items.map((item) => (
        <span key={item} className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
          {item}
          <button
            type="button"
            onClick={() => onChange(items.filter((v) => v !== item))}
            className="text-gray-400 hover:text-rose-600"
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
          className="h-7 min-w-24 flex-1 bg-transparent px-1.5 text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
        />
      )}
    </div>
  );
}

/** Agenda rows styled after the event page's timeline. */
export function AgendaEditor({ slots, onChange }: { slots: AgendaSlot[]; onChange: (slots: AgendaSlot[]) => void }) {
  const patch = (index: number, value: Partial<AgendaSlot>) =>
    onChange(slots.map((slot, i) => (i === index ? { ...slot, ...value } : slot)));

  return (
    <div className="space-y-3">
      <div className="relative space-y-3 pl-8 before:absolute before:bottom-3 before:left-3 before:top-3 before:w-0.5 before:bg-blue-100">
        {slots.map((slot, index) => (
          <div key={index} className="relative">
            <div className="absolute -left-8 top-3.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0066FF] bg-white">
              <div className="h-2 w-2 rounded-full bg-[#0066FF]" />
            </div>
            <div className="flex items-start gap-2 rounded-2xl border border-gray-100 bg-gray-50/80 p-2.5">
              <input
                value={slot.time}
                onChange={(e) => patch(index, { time: e.target.value })}
                placeholder="6:00 PM"
                className="h-9 w-28 shrink-0 rounded-lg bg-blue-50 px-2.5 text-xs font-bold text-[#0066FF] outline-none placeholder:text-blue-300 focus:ring-2 focus:ring-blue-200"
              />
              <input
                value={slot.item}
                onChange={(e) => patch(index, { item: e.target.value })}
                placeholder="What happens in this slot"
                className="h-9 min-w-0 flex-1 bg-transparent px-1 text-sm font-bold text-gray-900 outline-none placeholder:font-medium placeholder:text-gray-400"
              />
              <RowActions
                index={index}
                length={slots.length}
                onMove={(to) => onChange(move(slots, index, to))}
                onRemove={() => onChange(slots.filter((_, i) => i !== index))}
              />
            </div>
          </div>
        ))}
      </div>
      <AddRowButton label="Add agenda slot" onClick={() => onChange([...slots, { time: "", item: "" }])} />
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

export function FaqEditor({ faqs, onChange }: { faqs: Faq[]; onChange: (faqs: Faq[]) => void }) {
  const [jsonOpen, setJsonOpen] = useState(false);
  const [json, setJson] = useState("");

  const patch = (index: number, value: Partial<Faq>) =>
    onChange(faqs.map((faq, i) => (i === index ? { ...faq, ...value } : faq)));

  function importJson() {
    try {
      const items = parseFaqJson(json);
      onChange([...faqs.filter((f) => f.question.trim() || f.answer.trim()), ...items]);
      toast.success(`Imported ${items.length} FAQ${items.length === 1 ? "" : "s"}`);
      setJson("");
      setJsonOpen(false);
    } catch (err) {
      toast.error(err instanceof Error && err.message.startsWith("No FAQs") ? err.message : "That isn't valid JSON");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setJsonOpen((v) => !v)}>
          <Braces /> Paste JSON
        </Button>
      </div>

      {jsonOpen && (
        <div className="space-y-2 rounded-2xl border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-500">
            Paste <code className="rounded bg-white px-1">[{`{"question": "…", "answer": "…"}`}]</code> or a full
            FAQPage schema with <code className="rounded bg-white px-1">mainEntity</code>.
          </p>
          <Textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            className={cn(textareaClass, "min-h-32 font-mono text-xs")}
            placeholder={'[\n  { "question": "Who is this for?", "answer": "…" }\n]'}
          />
          <div className="flex justify-end">
            <Button type="button" size="sm" className="rounded-full" disabled={!json.trim()} onClick={importJson}>
              Import FAQs
            </Button>
          </div>
        </div>
      )}

      {faqs.map((faq, index) => (
        <div key={index} className="space-y-2 rounded-2xl border border-gray-200/80 bg-white p-3">
          <div className="flex items-center gap-2">
            <Input
              value={faq.question}
              onChange={(e) => patch(index, { question: e.target.value })}
              placeholder={`Question ${index + 1}`}
              className={cn(fieldClass, "font-bold")}
            />
            <RowActions
              index={index}
              length={faqs.length}
              onMove={(to) => onChange(move(faqs, index, to))}
              onRemove={() => onChange(faqs.filter((_, i) => i !== index))}
            />
          </div>
          <Textarea
            value={faq.answer}
            onChange={(e) => patch(index, { answer: e.target.value })}
            placeholder="Answer"
            className={cn(textareaClass, "min-h-20")}
          />
        </div>
      ))}

      <AddRowButton label="Add FAQ" onClick={() => onChange([...faqs, { question: "", answer: "" }])} />
    </div>
  );
}

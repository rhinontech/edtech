"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  META_DESCRIPTION_LIMIT,
  META_TITLE_LIMIT,
  THEME_KEYS,
  THEMES,
  type ThemeKey,
} from "@/lib/content";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Inputs take the landing site's form look (SaveSeatForm): soft gray fill,
// rounded-xl, blue focus ring.
export const fieldClass =
  "h-11 rounded-xl border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-900 shadow-none placeholder:text-gray-400 focus-visible:border-[#0066FF] focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-blue-100";

export const textareaClass =
  "min-h-24 rounded-xl border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 shadow-none placeholder:text-gray-400 focus-visible:border-[#0066FF] focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-blue-100";

export function SectionCard({
  title,
  description,
  icon,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm", className)}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066FF]">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-lg font-black tracking-tight text-gray-900">{title}</h2>
            {description && <p className="text-xs font-medium text-gray-500">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function RailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm">
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{title}</h2>
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  aside,
  children,
  className,
  group = false,
}: {
  label: string;
  hint?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Render as a div — for composite controls that hold several buttons. */
  group?: boolean;
}) {
  const Wrapper = group ? "div" : "label";
  return (
    <Wrapper className={cn("block", className)}>
      <span className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
        {aside}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs font-medium text-gray-400">{hint}</span>}
    </Wrapper>
  );
}

export function CharCount({ value, limit }: { value: string; limit: number }) {
  return (
    <span
      className={cn(
        "text-[10px] font-bold tabular-nums",
        value.length > limit ? "text-amber-600" : "text-gray-400"
      )}
    >
      {value.length}/{limit}
    </span>
  );
}

export function SlugField({
  prefix,
  value,
  onChange,
  warning,
}: {
  prefix: string;
  value: string;
  onChange: (value: string) => void;
  warning?: string | null;
}) {
  return (
    <Field label="URL" hint={warning ? <span className="text-amber-600">{warning}</span> : undefined}>
      <div className="flex h-11 items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 focus-within:border-[#0066FF] focus-within:bg-white focus-within:ring-3 focus-within:ring-blue-100">
        <span className="shrink-0 pl-4 text-sm font-medium text-gray-400">{prefix}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="auto-from-title"
          className="h-full w-full min-w-0 bg-transparent pr-4 text-sm font-semibold text-gray-900 outline-none placeholder:font-medium placeholder:text-gray-400"
        />
      </div>
    </Field>
  );
}

export function ThemePicker({ value, onChange }: { value: ThemeKey; onChange: (theme: ThemeKey) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {THEME_KEYS.map((key) => {
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            title={THEMES[key].label}
            aria-label={`${THEMES[key].label} theme`}
            aria-pressed={active}
            className={cn(
              "relative h-9 w-9 overflow-hidden rounded-full border-2 transition-all",
              THEMES[key].gradient,
              active ? "scale-110 border-gray-900 shadow-md" : "border-white shadow-sm ring-1 ring-gray-200 hover:scale-105"
            )}
          >
            {active && <Check className="absolute inset-0 m-auto size-4 text-white" strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-gray-100 p-1">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-bold transition-all",
            value === option ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/** Meta title/description with a Google result preview. */
export function SeoFields({
  metaTitle,
  metaDescription,
  onMetaTitle,
  onMetaDescription,
  fallbackTitle,
  fallbackDescription,
  url,
}: {
  metaTitle: string;
  metaDescription: string;
  onMetaTitle: (value: string) => void;
  onMetaDescription: (value: string) => void;
  fallbackTitle: string;
  fallbackDescription: string;
  url: string;
}) {
  const shownTitle = metaTitle || fallbackTitle || "Page title";
  const shownDescription = metaDescription || fallbackDescription || "Page description shown in search results.";

  return (
    <>
      <Field label="Meta title" aside={<CharCount value={metaTitle} limit={META_TITLE_LIMIT} />}>
        <Input
          value={metaTitle}
          onChange={(e) => onMetaTitle(e.target.value)}
          placeholder={fallbackTitle || "Falls back to the title"}
          className={fieldClass}
        />
      </Field>
      <Field label="Meta description" aside={<CharCount value={metaDescription} limit={META_DESCRIPTION_LIMIT} />}>
        <Textarea
          value={metaDescription}
          onChange={(e) => onMetaDescription(e.target.value)}
          placeholder={fallbackDescription || "Falls back to the summary"}
          className={textareaClass}
        />
      </Field>
      <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Search preview</div>
        <div className="truncate text-xs text-gray-600">{url}</div>
        <div className="mt-0.5 line-clamp-1 text-[17px] leading-snug text-[#1a0dab]">{shownTitle}</div>
        <div className="mt-1 line-clamp-2 text-[13px] leading-snug text-gray-600">{shownDescription}</div>
      </div>
    </>
  );
}

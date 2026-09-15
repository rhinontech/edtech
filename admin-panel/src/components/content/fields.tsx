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

// Quiet form controls: white fill, hairline border, soft indigo focus ring.
export const fieldClass =
  "h-9 rounded-lg border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-none placeholder:text-gray-400 focus-visible:border-gray-300 focus-visible:ring-[3px] focus-visible:ring-indigo-500/15";

export const textareaClass =
  "min-h-20 rounded-lg border-gray-200 bg-white px-3 py-2 text-sm leading-relaxed text-gray-900 shadow-none placeholder:text-gray-400 focus-visible:border-gray-300 focus-visible:ring-[3px] focus-visible:ring-indigo-500/15";

/** A titled block in the main editing column, separated by a hairline. */
export function Section({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-t border-gray-100 pt-8 first:border-t-0 first:pt-0", className)}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {description && <p className="mt-0.5 text-[13px] text-gray-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/** A group in the settings panel. */
export function RailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-gray-100 px-5 py-5 last:border-b-0">
      <h3 className="mb-4 text-xs font-semibold text-gray-900">{title}</h3>
      <div className="space-y-4">{children}</div>
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
      <span className="mb-1.5 flex min-h-4 items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        {aside}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-gray-400">{hint}</span>}
    </Wrapper>
  );
}

export function CharCount({ value, limit }: { value: string; limit: number }) {
  return (
    <span className={cn("text-[11px] tabular-nums", value.length > limit ? "text-amber-600" : "text-gray-400")}>
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
      <div className="flex h-9 items-center overflow-hidden rounded-lg border border-gray-200 bg-white transition focus-within:border-gray-300 focus-within:ring-[3px] focus-within:ring-indigo-500/15">
        <span className="shrink-0 pl-3 text-sm text-gray-400">{prefix}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="auto-from-title"
          className="h-full w-full min-w-0 bg-transparent pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
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
              "relative size-6 rounded-full transition-all",
              THEMES[key].gradient,
              active ? "ring-2 ring-gray-900 ring-offset-2" : "ring-1 ring-black/5 hover:scale-110"
            )}
          >
            {active && <Check className="absolute inset-0 m-auto size-3 text-white" strokeWidth={3} />}
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
    <div className="inline-flex h-9 rounded-lg bg-gray-100 p-0.5">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={cn(
            "rounded-md px-3 text-[13px] font-medium transition-all",
            value === option ? "bg-white text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-gray-500 hover:text-gray-900"
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
      <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-white ring-1 ring-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/uppercurve_logo_nav.png" alt="" className="size-3 object-contain" />
          </span>
          <div className="min-w-0 leading-tight">
            <div className="text-[11px] text-gray-700">UpperCurve</div>
            <div className="truncate text-[10px] text-gray-400">{url}</div>
          </div>
        </div>
        <div className="mt-2 line-clamp-1 text-[15px] leading-snug text-[#1a0dab]">{shownTitle}</div>
        <div className="mt-0.5 line-clamp-2 text-xs leading-snug text-gray-600">{shownDescription}</div>
      </div>
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
    </>
  );
}

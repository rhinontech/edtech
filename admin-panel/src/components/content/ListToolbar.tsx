"use client";

import { ChevronDown, LayoutGrid, List, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = "list" | "gallery";

/** Underlined filter tabs with counts. */
export function FilterTabs<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string; count: number }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="-mb-px flex gap-5 overflow-x-auto" role="tablist">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex h-10 shrink-0 items-center gap-1.5 border-b-2 text-[13px] font-medium transition-colors",
              active ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-900"
            )}
          >
            {option.label}
            <span className={cn("tabular-nums text-xs", active ? "text-gray-500" : "text-gray-400")}>{option.count}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-8 w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 text-[13px] text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-[3px] focus:ring-indigo-500/15 sm:w-56"
      />
    </div>
  );
}

export function PlainSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="h-8 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white pl-2.5 pr-7 text-[13px] text-gray-700 outline-none transition hover:border-gray-300 focus:ring-[3px] focus:ring-indigo-500/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

export function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (value: ViewMode) => void }) {
  const item = (mode: ViewMode, icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onClick={() => onChange(mode)}
      aria-pressed={value === mode}
      aria-label={label}
      title={label}
      className={cn(
        "flex size-7 items-center justify-center rounded-md transition-all",
        value === mode ? "bg-white text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-gray-400 hover:text-gray-900"
      )}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex h-8 items-center rounded-lg bg-gray-100 p-0.5">
      {item("list", <List className="size-3.5" />, "List view")}
      {item("gallery", <LayoutGrid className="size-3.5" />, "Gallery view — as on the website")}
    </div>
  );
}

export const STATUS_DOT: Record<string, string> = {
  Published: "bg-emerald-500",
  Live: "bg-emerald-500",
  Upcoming: "bg-emerald-500",
  Scheduled: "bg-indigo-500",
  Past: "bg-gray-300",
  Draft: "bg-amber-400",
};

export function StatusLabel({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-gray-600", className)}>
      <span className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT[status] ?? "bg-gray-300")} />
      {status}
    </span>
  );
}

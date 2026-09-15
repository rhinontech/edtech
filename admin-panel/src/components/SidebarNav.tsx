"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  Circle,
  FileText,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SidebarItemSummary } from "@/lib/backend";

// Sidebar items come from the database (Roles screen); icons and grouping
// are presentation only, keyed by the item's stable `key`.
const ICONS: Record<string, LucideIcon> = {
  overview: LayoutGrid,
  blogs: FileText,
  events: CalendarDays,
  roles: ShieldCheck,
  users: Users,
  settings: Settings,
};

const GROUPS: { label: string | null; keys: string[] }[] = [
  { label: null, keys: ["overview"] },
  { label: "Content", keys: ["blogs", "events"] },
  { label: "Workspace", keys: ["roles", "users", "settings"] },
];

export function SidebarNav({
  role,
  items,
  siteUrl,
  onNavigate,
}: {
  role: string;
  items: SidebarItemSummary[];
  siteUrl: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const known = new Set(GROUPS.flatMap((g) => g.keys));
  const groups = [
    ...GROUPS.map((g) => ({ label: g.label, items: items.filter((i) => g.keys.includes(i.key)) })),
    { label: "More", items: items.filter((i) => !known.has(i.key)) },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group, index) => (
          <div key={group.label ?? index}>
            {group.label && (
              <div className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-gray-400">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const href = `/${role}/${item.path}`;
                const active = pathname === href || pathname.startsWith(`${href}/`);
                const Icon = ICONS[item.key] ?? Circle;

                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex h-9 items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium transition-colors",
                      active ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon
                      className={cn("size-4", active ? "text-gray-900" : "text-gray-400 group-hover:text-gray-600")}
                      strokeWidth={1.75}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <a
          href={siteUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex h-9 items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <span className="relative flex size-4 items-center justify-center">
            <span className="absolute size-2 rounded-full bg-emerald-500/30 animate-ping" />
            <span className="size-1.5 rounded-full bg-emerald-500" />
          </span>
          Visit website
          <ArrowUpRight className="ml-auto size-3.5 text-gray-300 transition-colors group-hover:text-gray-500" />
        </a>
      </div>
    </div>
  );
}

export default SidebarNav;

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, ChevronRight, LogOut, Menu } from "lucide-react";
import type { BackendUser } from "@/lib/backend";
import { button } from "@/lib/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SidebarNav from "./SidebarNav";
import Wordmark from "./Wordmark";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** "Blogs / Edit" — the sidebar item the page lives under, then the sub-page. */
export function Breadcrumbs({ role, items }: { role: string; items: BackendUser["sidebarItems"] }) {
  const pathname = usePathname();
  const match = items
    .map((item) => ({ item, href: `/${role}/${item.path}` }))
    .filter(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];

  if (!match) return null;

  // Top-level pages already carry their own title; the trail only earns its
  // place once you're a level deeper (e.g. Blogs › Edit).
  const rest = pathname.slice(match.href.length).split("/").filter(Boolean);
  const leaf = rest[0] === "new" ? "New" : rest[0] && UUID_RE.test(rest[0]) ? "Edit" : null;
  if (!leaf) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13px]">
      <Link href={match.href} className="truncate font-medium text-gray-500 transition-colors hover:text-gray-900">
        {match.item.label}
      </Link>
      <ChevronRight className="size-3.5 shrink-0 text-gray-300" />
      <span className="truncate font-medium text-gray-900">{leaf}</span>
    </nav>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserMenu({ user, siteUrl }: { user: BackendUser; siteUrl: string }) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors outline-none hover:bg-gray-100 focus-visible:ring-[3px] focus-visible:ring-indigo-500/20 data-[state=open]:bg-gray-100"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white">
            {initials(user.name)}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-[13px] font-medium leading-4 text-gray-900">{user.name}</span>
            <span className="block text-[11px] leading-4 text-gray-400">{user.role.name}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-xl p-1.5">
        <DropdownMenuLabel className="px-2 py-2 font-normal">
          <div className="text-[13px] font-medium text-gray-900">{user.name}</div>
          <div className="truncate text-xs text-gray-500">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="rounded-lg text-[13px]">
          <a href={siteUrl} target="_blank" rel="noreferrer">
            <ArrowUpRight /> Visit website
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="rounded-lg text-[13px]"
          disabled={signingOut}
          onSelect={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          <LogOut /> {signingOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileNav({ role, items, siteUrl }: { role: string; items: BackendUser["sidebarItems"]; siteUrl: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className={`${button.icon} md:hidden`} aria-label="Open menu">
          <Menu />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-0 p-0">
        <SheetTitle className="flex h-16 items-center gap-2.5 border-b border-gray-100 px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/uppercurve_logo_nav.png" alt="" className="h-7 w-auto" />
          <Wordmark className="text-lg" />
        </SheetTitle>
        <SidebarNav role={role} items={items} siteUrl={siteUrl} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

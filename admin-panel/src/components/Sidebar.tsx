"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "./Wordmark";
import type { SidebarItemSummary } from "@/lib/backend";

export function Sidebar({ role, items }: { role: string; items: SidebarItemSummary[] }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-[#0B1B42] md:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-6">
        {/* The mark's "U" is navy, so it disappears on this navy sidebar —
            a light tile behind it restores contrast without flattening
            the gradient into solid white. */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
          <img src="/uppercurve_logo_nav.png" alt="UpperCurve" className="h-6 w-6 object-contain" />
        </div>
        <Wordmark dark className="text-lg" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {items.map((item) => {
          const href = `/${role}/${item.path}`;
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={item.key}
              href={href}
              className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition ${
                  active ? "bg-[#187CFA]" : "bg-transparent"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;

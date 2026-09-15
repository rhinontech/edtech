import SidebarNav from "./SidebarNav";
import type { SidebarItemSummary } from "@/lib/backend";

export function Sidebar({ role, items, siteUrl }: { role: string; items: SidebarItemSummary[]; siteUrl: string }) {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-100 bg-white md:block">
      <SidebarNav role={role} items={items} siteUrl={siteUrl} />
    </aside>
  );
}

export default Sidebar;

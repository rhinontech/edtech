import Link from "next/link";

const navItems = [
  { label: "Overview", href: "/dashboard", enabled: true },
  { label: "Users", href: "#", enabled: false },
  { label: "Settings", href: "#", enabled: false },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2.5 px-6 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
          A
        </div>
        <span className="text-sm font-bold tracking-tight text-slate-900">Admin Panel</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) =>
          item.enabled ? (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ) : (
            <span
              key={item.label}
              className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-300 cursor-not-allowed"
            >
              {item.label}
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-300">
                Soon
              </span>
            </span>
          )
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;

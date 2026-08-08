import RoleBadge from "./RoleBadge";
import LogoutButton from "./LogoutButton";
import type { BackendUser } from "@/lib/backend";

export function Topbar({ user }: { user: BackendUser }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0B1B42] px-6">
      <div>
        <div className="text-sm font-bold text-white">{user.name}</div>
        <div className="text-xs text-white/50">{user.email}</div>
      </div>
      <div className="flex items-center gap-3">
        <RoleBadge role={user.role.slug} />
        <LogoutButton />
      </div>
    </header>
  );
}

export default Topbar;

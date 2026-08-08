import { redirect } from "next/navigation";
import { getCurrentUser, BackendError } from "@/lib/backend";
import Sidebar from "@/components/Sidebar";
import RoleBadge from "@/components/RoleBadge";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    if (err instanceof BackendError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div>
            <div className="text-sm font-bold text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
          <div className="flex items-center gap-3">
            <RoleBadge role={user.role} />
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

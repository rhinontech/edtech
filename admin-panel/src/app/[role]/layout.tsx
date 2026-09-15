import { redirect } from "next/navigation";
import { getCurrentUser, BackendError, SITE_URL } from "@/lib/backend";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default async function RoleLayout({ children, params }: LayoutProps<"/[role]">) {
  const { role } = await params;

  let user;
  try {
    user = await getCurrentUser();
  } catch (err) {
    if (err instanceof BackendError && err.status === 401) {
      redirect("/auth/login");
    }
    throw err;
  }

  // The URL's [role] segment must match the signed-in user's actual role —
  // proxy.ts only checks "is this person logged in at all" (optimistic
  // check); this is the secure check per-request against real session data.
  if (role !== user.role.slug) {
    redirect(`/${user.role.slug}/dashboard`);
  }

  return (
    // App shell: the viewport never scrolls — only <main> does — so the
    // header and sidebar stay put. Pages own their padding, so sticky bars
    // inside them (editor headers, toolbars) sit flush at the top of <main>.
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Topbar user={user} siteUrl={SITE_URL} />

      <div className="flex min-h-0 flex-1">
        <Sidebar role={user.role.slug} items={user.sidebarItems} siteUrl={SITE_URL} />
        <main className="min-w-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

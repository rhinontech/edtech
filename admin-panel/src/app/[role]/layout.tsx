import { redirect } from "next/navigation";
import { getCurrentUser, BackendError } from "@/lib/backend";
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
    <div className="flex min-h-screen flex-1">
      {/* Sidebar + Topbar share the same navy background with no border
          between them, so they read as one dark shell wrapping the white
          content canvas. */}
      <Sidebar role={user.role.slug} items={user.sidebarItems} />

      <div className="flex flex-1 flex-col">
        <Topbar user={user} />
        <main className="flex-1 bg-white p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}

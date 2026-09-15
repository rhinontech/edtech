import { canAccess, getCurrentUser } from "@/lib/backend";
import AccessDenied from "@/components/content/AccessDenied";

// Same rule the backend enforces: the role must hold the "blogs" sidebar item.
export default async function BlogsLayout({ children }: LayoutProps<"/[role]/content/blogs">) {
  const user = await getCurrentUser();
  if (!canAccess(user, "blogs")) return <AccessDenied section="Blogs" />;
  return children;
}

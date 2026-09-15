import { canAccess, getCurrentUser } from "@/lib/backend";
import AccessDenied from "@/components/content/AccessDenied";

// Same rule the backend enforces: the role must hold the "events" sidebar item.
export default async function EventsLayout({ children }: LayoutProps<"/[role]/content/events">) {
  const user = await getCurrentUser();
  if (!canAccess(user, "events")) return <AccessDenied section="Events" />;
  return children;
}

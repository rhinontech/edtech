import { redirect } from "next/navigation";
import { canAccess, getCurrentUser } from "@/lib/backend";

export default async function ContentIndexPage({ params }: PageProps<"/[role]/content">) {
  const { role } = await params;
  const user = await getCurrentUser();
  redirect(`/${role}/content/${canAccess(user, "blogs") || !canAccess(user, "events") ? "blogs" : "events"}`);
}

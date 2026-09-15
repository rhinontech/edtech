import type { Metadata } from "next";
import { SITE_URL } from "@/lib/backend";
import { EventEditor } from "@/components/content/events/EventEditor";

export const metadata: Metadata = {
  title: "New event — Admin Panel",
};

export default async function NewEventPage({ params }: PageProps<"/[role]/content/events/new">) {
  const { role } = await params;
  return <EventEditor basePath={`/${role}/content/events`} siteUrl={SITE_URL} />;
}

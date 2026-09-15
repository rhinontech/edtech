import type { Metadata } from "next";
import { listEvents, SITE_URL } from "@/lib/backend";
import { EventsBoard } from "@/components/content/events/EventsBoard";

export const metadata: Metadata = {
  title: "Events — Admin Panel",
};

export default async function EventsPage({ params }: PageProps<"/[role]/content/events">) {
  const { role } = await params;
  const events = await listEvents();
  return <EventsBoard events={events} basePath={`/${role}/content/events`} siteUrl={SITE_URL} />;
}

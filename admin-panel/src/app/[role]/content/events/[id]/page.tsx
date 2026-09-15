import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackendError, getEvent, SITE_URL } from "@/lib/backend";
import { EventEditor } from "@/components/content/events/EventEditor";

export const metadata: Metadata = {
  title: "Edit event — Admin Panel",
};

export default async function EditEventPage({ params }: PageProps<"/[role]/content/events/[id]">) {
  const { role, id } = await params;

  const event = await getEvent(id).catch((err) => {
    if (err instanceof BackendError && err.status === 404) notFound();
    throw err;
  });

  return <EventEditor key={event.id} event={event} basePath={`/${role}/content/events`} siteUrl={SITE_URL} />;
}

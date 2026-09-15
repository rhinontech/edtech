"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { isPastEvent, type EventItem } from "@/lib/content";
import { contentApi } from "../api";
import { ConfirmDelete } from "../ConfirmDelete";
import { EventCard } from "../site/EventSite";

type Filter = "All" | "Upcoming" | "Past" | "Drafts";

function matches(event: EventItem, filter: Filter) {
  if (filter === "All") return true;
  if (filter === "Drafts") return event.status !== "Published";
  if (event.status !== "Published") return false;
  return filter === "Past" ? isPastEvent(event) : !isPastEvent(event);
}

export function EventsBoard({ events, basePath, siteUrl }: { events: EventItem[]; basePath: string; siteUrl: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<EventItem | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => matches(e, filter))
      .filter((e) => !q || `${e.title} ${e.tagline} ${e.type} ${e.location} ${e.instructor.name}`.toLowerCase().includes(q));
  }, [events, filter, query]);

  async function handleDelete(event: EventItem) {
    try {
      await contentApi.deleteEvent(event.id);
      toast.success("Event deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete");
    }
  }

  return (
    <div className="mx-auto max-w-7xl font-sans">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-1 py-1 pr-3 shadow-sm">
            <span className="rounded-full bg-[#0066FF] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">Events</span>
            <span className="text-sm font-[450] text-blue-950">Workshops, masterclasses & meetups</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Events & Masterclasses</h1>
          <div className="mt-2.5 h-1 w-20 rounded-full bg-[#0066FF]" />
        </div>
        <Link
          href={`${basePath}/new`}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0070F3] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#005FE0] hover:shadow-md active:scale-95"
        >
          <Plus className="size-4" /> New event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/60 px-6 py-20 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">No events yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">Create a workshop or masterclass and publish it to the events page.</p>
          <Link href={`${basePath}/new`} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0070F3] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#005FE0]">
            <Plus className="size-4" /> Create an event
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(["All", "Upcoming", "Past", "Drafts"] as Filter[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                    filter === f ? "bg-[#0066FF] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {f === "All" ? "All Events" : f}
                  <span className={cn("rounded-full px-1.5 text-[10px] font-bold", filter === f ? "bg-white/20" : "bg-white text-gray-500")}>
                    {events.filter((e) => matches(e, f)).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events"
                className="w-full rounded-full border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm font-medium text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#0066FF] focus:ring-3 focus:ring-blue-100"
              />
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 px-6 py-16 text-center text-sm font-medium text-gray-500">
              No events match these filters.
            </div>
          ) : (
            <div className="uc-site space-y-6">
              {visible.map((event) => {
                const published = event.status === "Published";
                const past = isPastEvent(event);
                const href = `${basePath}/${event.id}`;
                return (
                  <div key={event.id} className="relative">
                    <EventCard
                      event={event}
                      siteUrl={siteUrl}
                      titleSlot={
                        <Link href={href} className="after:absolute after:inset-0 after:z-30 after:rounded-2xl">
                          {event.title}
                        </Link>
                      }
                      status={
                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold",
                            !published
                              ? "border-amber-200/60 bg-amber-50 text-amber-700"
                              : past
                                ? "border-gray-200 bg-gray-50 text-gray-500"
                                : "border-emerald-200 bg-emerald-50 text-emerald-700"
                          )}
                        >
                          {!published ? "Draft" : past ? "Past event" : "Live on site"}
                        </span>
                      }
                      actions={
                        <>
                          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                            <span
                              className={cn(
                                "inline-block h-2 w-2 rounded-full",
                                !published ? "bg-amber-400" : past ? "bg-gray-300" : "bg-emerald-500 animate-pulse"
                              )}
                            />
                            <span>Edited {new Date(event.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                          <div className="relative z-40 flex items-center gap-1.5">
                            {published && (
                              <a
                                href={`${siteUrl}/events/${event.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-[#0066FF]"
                                title="View on website"
                              >
                                <ExternalLink className="size-4" />
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => setPendingDelete(event)}
                              className="rounded-lg p-2.5 text-gray-500 transition hover:bg-rose-50 hover:text-rose-600"
                              title="Delete event"
                            >
                              <Trash2 className="size-4" />
                            </button>
                            <Link
                              href={href}
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#0070F3] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#005FE0] hover:shadow-md active:scale-95 sm:text-sm"
                            >
                              Edit event <span aria-hidden>→</span>
                            </Link>
                          </div>
                        </>
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <ConfirmDelete
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        what="event"
        name={pendingDelete?.title || ""}
        published={pendingDelete?.status === "Published"}
        onConfirm={() => pendingDelete && handleDelete(pendingDelete)}
      />
    </div>
  );
}

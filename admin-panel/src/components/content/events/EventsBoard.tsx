"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Copy, ExternalLink, MoreHorizontal, PencilLine, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { button, surface } from "@/lib/ui";
import { eventMonthDay, formatEventDateLabel, isPastEvent, type EventItem } from "@/lib/content";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState, Page } from "@/components/Page";
import { contentApi } from "../api";
import { ConfirmDelete } from "../ConfirmDelete";
import { FilterTabs, SearchInput, StatusLabel, ViewToggle, type ViewMode } from "../ListToolbar";
import { EventCard } from "../site/EventSite";

type Filter = "all" | "Upcoming" | "Past" | "Draft";

function statusOf(event: EventItem): Exclude<Filter, "all"> {
  if (event.status !== "Published") return "Draft";
  return isPastEvent(event) ? "Past" : "Upcoming";
}

export function EventsBoard({ events, basePath, siteUrl }: { events: EventItem[]; basePath: string; siteUrl: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>("list");
  const [pendingDelete, setPendingDelete] = useState<EventItem | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events
      .filter((e) => filter === "all" || statusOf(e) === filter)
      .filter((e) => !q || `${e.title} ${e.tagline} ${e.type} ${e.location} ${e.instructor.name}`.toLowerCase().includes(q));
  }, [events, filter, query]);

  const count = (f: Filter) => (f === "all" ? events.length : events.filter((e) => statusOf(e) === f).length);

  async function handleDelete(event: EventItem) {
    try {
      await contentApi.deleteEvent(event.id);
      toast.success("Event deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete");
    }
  }

  function copyLink(event: EventItem) {
    navigator.clipboard.writeText(`${siteUrl}/events/${event.slug}`).then(
      () => toast.success("Link copied"),
      () => toast.error("Couldn't copy the link")
    );
  }

  const newEvent = (
    <Link href={`${basePath}/new`} className={button.primary}>
      <Plus /> New event
    </Link>
  );

  return (
    <Page title="Events" description="Workshops, masterclasses and meetups on the UpperCurve website." actions={events.length > 0 && newEvent}>
      {events.length === 0 ? (
        <EmptyState
          icon={<CalendarDays />}
          title="No events yet"
          description="Create a workshop or masterclass and publish it to the events page."
          action={newEvent}
        />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-gray-100">
            <FilterTabs
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All", count: count("all") },
                { value: "Upcoming", label: "Upcoming", count: count("Upcoming") },
                { value: "Past", label: "Past", count: count("Past") },
                { value: "Draft", label: "Drafts", count: count("Draft") },
              ]}
            />
            <div className="flex items-center gap-2 pb-2">
              <SearchInput value={query} onChange={setQuery} placeholder="Search events" />
              <ViewToggle value={view} onChange={setView} />
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-500">No events match these filters.</p>
          ) : view === "gallery" ? (
            <div className="uc-site space-y-6">
              {visible.map((event) => (
                <div key={event.id} className="relative">
                  <EventCard
                    event={event}
                    siteUrl={siteUrl}
                    titleSlot={
                      <Link href={`${basePath}/${event.id}`} className="after:absolute after:inset-0 after:z-30 after:rounded-2xl">
                        {event.title}
                      </Link>
                    }
                    status={<StatusLabel status={statusOf(event)} />}
                    actions={
                      <>
                        <span className="text-xs text-gray-400">
                          Edited {new Date(event.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                        <span className={cn(button.secondary, "h-8")}>Edit event</span>
                      </>
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={surface}>
              <div className="hidden grid-cols-[minmax(0,1fr)_160px_110px_40px] items-center gap-4 border-b border-gray-100 px-4 py-2.5 text-xs text-gray-400 md:grid">
                <span>Event</span>
                <span>When</span>
                <span>Status</span>
                <span />
              </div>
              <ul className="divide-y divide-gray-100">
                {visible.map((event) => {
                  const s = statusOf(event);
                  const { month, day } = eventMonthDay(event.startDate);
                  const href = `${basePath}/${event.id}`;
                  return (
                    <li
                      key={event.id}
                      className="group relative grid grid-cols-[minmax(0,1fr)_40px] items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50/70 md:grid-cols-[minmax(0,1fr)_160px_110px_40px]"
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div
                          className={cn(
                            "flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-white ring-1 ring-gray-200/80",
                            s === "Past" && "opacity-60"
                          )}
                        >
                          <span className="text-[9px] font-semibold uppercase leading-none tracking-wider text-indigo-600">{month || "TBC"}</span>
                          <span className="mt-0.5 text-base font-semibold leading-none text-gray-900 tabular-nums">{day || "—"}</span>
                        </div>
                        <div className="min-w-0">
                          <Link href={href} className="block truncate text-[13px] font-medium text-gray-900 after:absolute after:inset-0">
                            {event.title || "Untitled"}
                          </Link>
                          <div className="truncate text-xs text-gray-500">
                            {[event.type, event.location || event.mode, event.instructor.name].filter(Boolean).join(" · ")}
                          </div>
                        </div>
                      </div>
                      <div className="hidden min-w-0 md:block">
                        <div className="truncate text-xs text-gray-700">{formatEventDateLabel(event.startDate, event.endDate) || "Date TBC"}</div>
                        <div className="truncate text-xs text-gray-400">{event.timeLabel || "Time TBC"}</div>
                      </div>
                      <StatusLabel status={s} className="hidden md:inline-flex" />
                      <div className="relative z-10 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className={cn(button.icon, "data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900")} aria-label={`Actions for ${event.title}`}>
                              <MoreHorizontal />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5">
                            <DropdownMenuItem asChild className="rounded-lg text-[13px]">
                              <Link href={href}>
                                <PencilLine /> Edit
                              </Link>
                            </DropdownMenuItem>
                            {event.status === "Published" && (
                              <DropdownMenuItem asChild className="rounded-lg text-[13px]">
                                <a href={`${siteUrl}/events/${event.slug}`} target="_blank" rel="noreferrer">
                                  <ExternalLink /> View on website
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="rounded-lg text-[13px]" onSelect={() => copyLink(event)}>
                              <Copy /> Copy link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" className="rounded-lg text-[13px]" onSelect={() => setPendingDelete(event)}>
                              <Trash2 /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  );
                })}
              </ul>
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
    </Page>
  );
}

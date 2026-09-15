import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Plus } from "lucide-react";
import {
  BackendError,
  canAccess,
  getAdminOverview,
  getCurrentUser,
  listBlogs,
  listEvents,
} from "@/lib/backend";
import { formatDateLabel, formatEventDateLabel, isPastEvent, isScheduled } from "@/lib/content";
import { cn } from "@/lib/utils";
import { surface, text } from "@/lib/ui";
import { Page } from "@/components/Page";

export const metadata: Metadata = {
  title: "Overview — Admin Panel",
};

const TIMEZONE = "Asia/Kolkata";

/** The overview endpoint is limited to the built-in roles; other roles just don't see member stats. */
function nullIfForbidden(err: unknown) {
  if (err instanceof BackendError && err.status === 403) return null;
  throw err;
}

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: TIMEZONE }).format(new Date()));
  return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

function relativeDay(iso: string) {
  const day = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(d);
  const then = new Date(iso);
  const diff = Math.round((Date.parse(day(new Date())) - Date.parse(day(then))) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: TIMEZONE }).format(then);
}

const STAT_COLUMNS = ["", "lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"];

const STATUS_DOT = {
  Published: "bg-emerald-500",
  Scheduled: "bg-indigo-500",
  Upcoming: "bg-emerald-500",
  Past: "bg-gray-300",
  Draft: "bg-amber-400",
} as const;

export default async function DashboardPage({ params }: PageProps<"/[role]/dashboard">) {
  const { role } = await params;
  const user = await getCurrentUser();
  const blogsAllowed = canAccess(user, "blogs");
  const eventsAllowed = canAccess(user, "events");

  const [overview, posts, events] = await Promise.all([
    getAdminOverview().catch(nullIfForbidden),
    blogsAllowed ? listBlogs() : Promise.resolve([]),
    eventsAllowed ? listEvents() : Promise.resolve([]),
  ]);

  const publishedPosts = posts.filter((p) => p.status === "Published" && !isScheduled(p)).length;
  const upcomingEvents = events.filter((e) => e.status === "Published" && !isPastEvent(e)).length;
  const drafts = posts.filter((p) => p.status === "Draft").length + events.filter((e) => e.status === "Draft").length;

  const stats = [
    blogsAllowed && { label: "Published posts", value: publishedPosts, href: `/${role}/content/blogs` },
    eventsAllowed && { label: "Upcoming events", value: upcomingEvents, href: `/${role}/content/events` },
    (blogsAllowed || eventsAllowed) && { label: "Drafts", value: drafts, href: `/${role}/content/blogs` },
    overview && { label: "Team members", value: overview.totalUsers, href: null },
  ].filter(Boolean) as { label: string; value: number; href: string | null }[];

  const recent = [
    ...posts.map((p) => ({
      id: p.id,
      kind: "Post" as const,
      title: p.title,
      detail: formatDateLabel(p.publishDate),
      status: p.status === "Draft" ? "Draft" : isScheduled(p) ? "Scheduled" : "Published",
      updatedAt: p.updatedAt,
      href: `/${role}/content/blogs/${p.id}`,
    })),
    ...events.map((e) => ({
      id: e.id,
      kind: "Event" as const,
      title: e.title,
      detail: formatEventDateLabel(e.startDate, e.endDate) || "Date TBC",
      status: e.status === "Draft" ? "Draft" : isPastEvent(e) ? "Past" : "Upcoming",
      updatedAt: e.updatedAt,
      href: `/${role}/content/events/${e.id}`,
    })),
  ]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);

  const today = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: TIMEZONE }).format(new Date());

  return (
    <Page title={`${greeting()}, ${user.name.split(" ")[0]}`} description={today}>
      {stats.length > 0 && (
        <div className={cn(surface, "mb-10 grid grid-cols-2 divide-gray-100 overflow-hidden lg:divide-x", STAT_COLUMNS[stats.length])}>
          {stats.map((stat) => {
            const body = (
              <>
                <div className={text.label}>{stat.label}</div>
                <div className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.02em] text-gray-900 tabular-nums">
                  {stat.value}
                </div>
              </>
            );
            return stat.href ? (
              <Link key={stat.label} href={stat.href} className="p-5 transition-colors hover:bg-gray-50/70">
                {body}
              </Link>
            ) : (
              <div key={stat.label} className="p-5">
                {body}
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className={text.sectionTitle}>Recently edited</h2>
          </div>
          {recent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 px-6 py-12 text-center text-sm text-gray-500">
              {blogsAllowed || eventsAllowed ? "Nothing here yet — create your first post or event." : "You don't have access to any content sections."}
            </div>
          ) : (
            <ul className={cn(surface, "divide-y divide-gray-100")}>
              {recent.map((item) => (
                <li key={`${item.kind}-${item.id}`}>
                  <Link href={item.href} className="group flex items-center gap-3.5 px-4 py-3 transition-colors hover:bg-gray-50/70">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400 ring-1 ring-gray-200/70">
                      {item.kind === "Post" ? <FileText className="size-4" strokeWidth={1.75} /> : <CalendarDays className="size-4" strokeWidth={1.75} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-gray-900">{item.title || "Untitled"}</span>
                      <span className="block truncate text-xs text-gray-500">
                        {item.kind} · {item.detail}
                      </span>
                    </span>
                    <span className="hidden items-center gap-1.5 text-xs text-gray-500 sm:flex">
                      <span className={cn("size-1.5 rounded-full", STATUS_DOT[item.status as keyof typeof STATUS_DOT])} />
                      {item.status}
                    </span>
                    <span className="w-20 text-right text-xs text-gray-400">{relativeDay(item.updatedAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="space-y-8">
          {(blogsAllowed || eventsAllowed) && (
            <section>
              <h2 className={cn(text.sectionTitle, "mb-3")}>Create</h2>
              <div className={cn(surface, "divide-y divide-gray-100")}>
                {blogsAllowed && (
                  <QuickAction href={`/${role}/content/blogs/new`} icon={<FileText className="size-4" strokeWidth={1.75} />} label="Write a post" hint="Blog article" />
                )}
                {eventsAllowed && (
                  <QuickAction href={`/${role}/content/events/new`} icon={<CalendarDays className="size-4" strokeWidth={1.75} />} label="Create an event" hint="Workshop or masterclass" />
                )}
              </div>
            </section>
          )}

          {overview && (
            <section>
              <h2 className={cn(text.sectionTitle, "mb-3")}>Members by role</h2>
              <dl className={cn(surface, "divide-y divide-gray-100")}>
                {Object.entries(overview.byRole).map(([slug, count]) => (
                  <div key={slug} className="flex items-center justify-between px-4 py-2.5 text-[13px]">
                    <dt className="capitalize text-gray-600">{slug.replace(/-/g, " ")}</dt>
                    <dd className="font-medium text-gray-900 tabular-nums">{count}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section>
            <h2 className={cn(text.sectionTitle, "mb-3")}>Your account</h2>
            <dl className={cn(surface, "divide-y divide-gray-100 text-[13px]")}>
              {[
                ["Email", user.email],
                ["Role", user.role.name],
                ["Last sign-in", user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: TIMEZONE }) : "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-2.5">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="truncate font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </Page>
  );
}

function QuickAction({ href, icon, label, hint }: { href: string; icon: React.ReactNode; label: string; hint: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50/70">
      <span className="flex size-8 items-center justify-center rounded-lg bg-gray-900 text-white">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13px] font-medium text-gray-900">{label}</span>
        <span className="block text-xs text-gray-500">{hint}</span>
      </span>
      <span className="text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-gray-600">
        <Plus className="size-4 group-hover:hidden" />
        <ArrowRight className="hidden size-4 group-hover:block" />
      </span>
    </Link>
  );
}

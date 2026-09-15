// Shared (client + server) types and helpers for the Blogs & Events CMS.
// The shapes mirror Backend/src/controllers/{blogs,events}.controller.js.

export type ContentStatus = "Draft" | "Published";

export type ThemeKey = "indigo" | "cyan" | "emerald" | "fuchsia" | "amber" | "rose";

export interface Faq {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  theme: ThemeKey;
  coverImage: string | null;
  contentHtml: string;
  faqs: Faq[];
  tags: string[];
  readTime: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  status: ContentStatus;
  publishDate: string; // yyyy-MM-dd
  createdAt: string;
  updatedAt: string;
}

export type EventMode = "Online" | "In person";

export interface EventPoster {
  ribbon: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badgeType: string;
}

export interface EventInstructor {
  name: string;
  role: string;
  bio: string;
  avatar: string | null;
  highlights: string[];
}

export interface AgendaSlot {
  time: string;
  item: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  type: string;
  mode: EventMode;
  location: string;
  startDate: string | null; // yyyy-MM-dd
  endDate: string | null;
  timeLabel: string;
  theme: ThemeKey;
  coverImage: string | null;
  aboutHtml: string;
  agenda: AgendaSlot[];
  takeaways: string[];
  audience: string[];
  poster: EventPoster;
  instructor: EventInstructor;
  priceLabel: string;
  certificateLabel: string;
  metaTitle: string | null;
  metaDescription: string | null;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export type BlogInput = Omit<BlogPost, "id" | "createdAt" | "updatedAt">;
export type EventInput = Omit<EventItem, "id" | "createdAt" | "updatedAt">;

// ── Themes ────────────────────────────────────────────────────────────
// Class strings are copied verbatim from the landing site (blogData.ts,
// eventsData.ts and FeaturedMasterclass's EVENT_VISUALS). They must stay
// literal so Tailwind's scanner picks them up.
export const THEMES: Record<
  ThemeKey,
  { label: string; chip: string; gradient: string; banner: string; accent: string; swatch: string }
> = {
  indigo: {
    label: "Indigo",
    chip: "bg-indigo-50 border-indigo-100 text-indigo-600",
    gradient: "bg-gradient-to-br from-indigo-500 via-indigo-700 to-slate-950",
    banner: "from-[#021338] via-[#052b82] to-[#0b4bc9]",
    accent: "#FACC15",
    swatch: "#4f46e5",
  },
  cyan: {
    label: "Sky",
    chip: "bg-cyan-50 border-cyan-100 text-cyan-600",
    gradient: "bg-gradient-to-br from-cyan-400 via-sky-600 to-slate-950",
    banner: "from-[#022036] via-[#054975] to-[#0a7dbf]",
    accent: "#38BDF8",
    swatch: "#0284c7",
  },
  emerald: {
    label: "Emerald",
    chip: "bg-emerald-50 border-emerald-100 text-emerald-600",
    gradient: "bg-gradient-to-br from-emerald-400 via-teal-600 to-slate-950",
    banner: "from-[#02281a] via-[#065b3c] to-[#0b9c65]",
    accent: "#34D399",
    swatch: "#0d9488",
  },
  fuchsia: {
    label: "Fuchsia",
    chip: "bg-fuchsia-50 border-fuchsia-100 text-fuchsia-600",
    gradient: "bg-gradient-to-br from-fuchsia-500 via-purple-700 to-slate-950",
    banner: "from-[#23033d] via-[#5b0e8c] to-[#991ec7]",
    accent: "#F472B6",
    swatch: "#9333ea",
  },
  amber: {
    label: "Amber",
    chip: "bg-amber-50 border-amber-100 text-amber-600",
    gradient: "bg-gradient-to-br from-amber-400 via-orange-600 to-stone-950",
    banner: "from-[#291202] via-[#753406] to-[#b8520b]",
    accent: "#FDE047",
    swatch: "#ea580c",
  },
  rose: {
    label: "Rose",
    chip: "bg-rose-50 border-rose-100 text-rose-600",
    gradient: "bg-gradient-to-br from-rose-400 via-rose-600 to-stone-950",
    banner: "from-[#2e0214] via-[#730533] to-[#be0c52]",
    accent: "#FB7185",
    swatch: "#e11d48",
  },
};

export const THEME_KEYS = Object.keys(THEMES) as ThemeKey[];

export function themeOf(key: string | null | undefined) {
  return THEMES[(key as ThemeKey) in THEMES ? (key as ThemeKey) : "indigo"];
}

// The landing site's current blog categories and event types — offered as
// suggestions; editors can still type a new one.
export const BLOG_CATEGORIES = [
  "Artificial Intelligence",
  "Careers & Interviews",
  "Product & Business",
  "Learning & Growth",
  "Community & Events",
];

export const EVENT_TYPES = ["Workshop", "Masterclass", "Showcase", "Build Jam", "AMA", "Meetup"];

// ── Helpers ───────────────────────────────────────────────────────────

export function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function htmlToText(html: string): string {
  return (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isEmptyHtml(html: string): boolean {
  return !htmlToText(html) && !/<(img|iframe|video)\b|data-video-embed/i.test(html || "");
}

const WORDS_PER_MINUTE = 200;

export function readTimeFromHtml(html: string): string {
  const words = htmlToText(html).split(" ").filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseDay(iso: string | null | undefined) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]) - 1, day: Number(m[3]) };
}

/** "Jul 28, 2026" — parsed from the yyyy-MM-dd string, so no timezone drift. */
export function formatDateLabel(iso: string | null | undefined): string {
  const d = parseDay(iso);
  return d ? `${MONTHS[d.month]} ${d.day}, ${d.year}` : "";
}

/** "Aug 22, 2026", "Sep 18–20, 2026" or "Sep 30 – Oct 2, 2026" — matches eventsData.ts. */
export function formatEventDateLabel(start: string | null, end: string | null): string {
  const s = parseDay(start);
  if (!s) return "";
  const e = parseDay(end);
  if (!e || (e.year === s.year && e.month === s.month && e.day === s.day)) {
    return formatDateLabel(start);
  }
  if (e.year !== s.year) return `${formatDateLabel(start)} – ${formatDateLabel(end)}`;
  if (e.month !== s.month) return `${MONTHS[s.month]} ${s.day} – ${MONTHS[e.month]} ${e.day}, ${s.year}`;
  return `${MONTHS[s.month]} ${s.day}–${e.day}, ${s.year}`;
}

export function eventMonthDay(start: string | null) {
  const s = parseDay(start);
  return s ? { month: MONTHS[s.month], day: String(s.day).padStart(2, "0") } : { month: "", day: "" };
}

export function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Published but dated in the future — the public API hides these until the day arrives. */
export function isScheduled(post: Pick<BlogPost, "status" | "publishDate">): boolean {
  return post.status === "Published" && post.publishDate > todayIso();
}

export function isPastEvent(event: Pick<EventItem, "startDate" | "endDate">): boolean {
  const last = event.endDate || event.startDate;
  return !!last && last < todayIso();
}

/**
 * Seeded content points at the landing site's own public assets
 * (e.g. "/instructor/image1.avif"); resolve those against the site URL
 * so they also load inside the admin panel.
 */
export function resolveAsset(url: string | null | undefined, siteUrl: string): string {
  if (!url) return "";
  if (url.startsWith("/") && !url.startsWith("//")) return `${siteUrl.replace(/\/$/, "")}${url}`;
  return url;
}

/** h2 headings for the "In this article" table of contents, with ids matching slugifyHeading on the site. */
export function extractHeadings(html: string): { id: string; text: string }[] {
  const out: { id: string; text: string }[] = [];
  const re = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html || ""))) {
    const text = htmlToText(m[1]);
    if (text) out.push({ id: slugify(text), text });
  }
  return out;
}

export const META_TITLE_LIMIT = 60;
export const META_DESCRIPTION_LIMIT = 160;

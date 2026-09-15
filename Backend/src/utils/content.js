const sanitizeHtml = require("sanitize-html");
const { Op } = require("sequelize");

const CONTENT_STATUSES = ["Draft", "Published"];
const EVENT_MODES = ["Online", "In person"];
// Colour themes offered by the landing site's posters and chips.
const THEMES = ["indigo", "cyan", "emerald", "fuchsia", "amber", "rose"];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isUuid(value) {
  return UUID_RE.test(String(value || ""));
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug unique within `Model`, suffixing -2, -3… on collision. */
async function uniqueSlug(Model, raw, excludeId) {
  const base = slugify(raw) || "untitled";
  let slug = base;
  let suffix = 2;

  for (;;) {
    const where = { slug };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    if (!(await Model.findOne({ where, attributes: ["id"] }))) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

// ── Input coercion ───────────────────────────────────────────────────

function str(value, max = 10000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function nullableStr(value, max) {
  const s = str(value, max);
  return s || null;
}

function strList(value, { max = 50, maxLength = 500 } = {}) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => str(item, maxLength))
    .filter(Boolean)
    .slice(0, max);
}

function oneOf(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function dateOnly(value) {
  return typeof value === "string" && DATE_RE.test(value) ? value : null;
}

/** Image fields accept http(s) URLs or site-relative paths ("/instructor/a.avif"). */
function imageUrl(value) {
  const s = str(value, 2000);
  if (!s) return null;
  if (/^https?:\/\//i.test(s) || (s.startsWith("/") && !s.startsWith("//"))) return s;
  return null;
}

function faqList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((faq) => ({ question: str(faq?.question, 500), answer: str(faq?.answer, 5000) }))
    .filter((faq) => faq.question && faq.answer)
    .slice(0, 50);
}

// ── Rich text ────────────────────────────────────────────────────────
// Mirrors what the admin panel's TipTap editor can produce (StarterKit,
// text style/colour/highlight, alignment, tables, images, video embeds).
// Anything else is stripped so the landing site can render it as-is.

const COLOR = [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i, /^inherit$/];
const LENGTH = [/^\d+(\.\d+)?(px|%|em|rem)$/, /^auto$/];

const SANITIZE_OPTIONS = {
  allowedTags: [
    "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s",
    "sub", "sup", "mark", "span", "a", "ul", "ol", "li", "blockquote",
    "code", "pre", "hr", "img", "table", "thead", "tbody", "tr", "th", "td",
    "colgroup", "col", "div", "video", "iframe",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "style", "data-align"],
    mark: ["style", "data-color"],
    span: ["style"],
    p: ["style"],
    h2: ["style"],
    h3: ["style"],
    h4: ["style"],
    th: ["colspan", "rowspan", "colwidth", "style"],
    td: ["colspan", "rowspan", "colwidth", "style"],
    col: ["style"],
    div: ["data-video-embed", "data-src", "data-kind", "data-video-id", "data-width", "style"],
    video: ["src", "controls", "style"],
    iframe: ["src", "style", "allowfullscreen"],
  },
  allowedStyles: {
    "*": {
      color: COLOR,
      "background-color": COLOR,
      "text-align": [/^(left|right|center|justify)$/],
      "font-family": [/^[\w\s,'"-]+$/],
      width: LENGTH,
      "max-width": LENGTH,
      height: LENGTH.concat([/^0$/]),
      display: [/^block$/],
      "margin-left": LENGTH.concat([/^0$/]),
      "margin-right": LENGTH.concat([/^0$/]),
      position: [/^(relative|absolute)$/],
      "padding-bottom": LENGTH,
      inset: [/^0$/],
      border: [/^0$/],
    },
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  allowedIframeHostnames: ["www.youtube-nocookie.com", "www.youtube.com"],
  // A disallowed iframe/img loses its src; drop the empty shell entirely.
  exclusiveFilter: (frame) => ["iframe", "img", "video"].includes(frame.tag) && !frame.attribs.src,
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs:
        attribs.target === "_blank"
          ? { ...attribs, rel: "noopener noreferrer" }
          : attribs,
    }),
  },
};

function richText(value) {
  if (typeof value !== "string") return "";
  const clean = sanitizeHtml(value.slice(0, 500000), SANITIZE_OPTIONS);
  return isEmptyHtml(clean) ? "" : clean;
}

function htmlToText(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isEmptyHtml(html) {
  return !htmlToText(html) && !/<(img|iframe|video)\b|data-video-embed/i.test(html || "");
}

function readTimeFromHtml(html) {
  const words = htmlToText(html).split(" ").filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/**
 * Adds stable ids to <h2>s and returns them as a table of contents, so the
 * landing site's "In this article" links work without parsing HTML itself.
 */
function withHeadingIds(html) {
  const toc = [];
  const used = new Set();
  const out = String(html || "").replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, inner) => {
    const text = htmlToText(inner);
    if (!text) return match;
    let id = slugify(text) || "section";
    for (let n = 2; used.has(id); n += 1) id = `${slugify(text)}-${n}`;
    used.add(id);
    toc.push({ id, text });
    const cleanAttrs = attrs.replace(/\sid="[^"]*"/i, "");
    return `<h2 id="${id}"${cleanAttrs}>${inner}</h2>`;
  });
  return { html: out, toc };
}

// ── Dates ────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseDay(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || "");
  return m ? { year: Number(m[1]), month: Number(m[2]) - 1, day: Number(m[3]) } : null;
}

function dateLabel(iso) {
  const d = parseDay(iso);
  return d ? `${MONTHS[d.month]} ${d.day}, ${d.year}` : "";
}

/** Matches the landing site's labels: "Aug 22, 2026", "Sep 18–20, 2026". */
function eventDateLabel(start, end) {
  const s = parseDay(start);
  if (!s) return "";
  const e = parseDay(end);
  if (!e || start === end) return dateLabel(start);
  if (e.year !== s.year) return `${dateLabel(start)} – ${dateLabel(end)}`;
  if (e.month !== s.month) return `${MONTHS[s.month]} ${s.day} – ${MONTHS[e.month]} ${e.day}, ${s.year}`;
  return `${MONTHS[s.month]} ${s.day}–${e.day}, ${s.year}`;
}

function monthDay(start) {
  const s = parseDay(start);
  return s ? { month: MONTHS[s.month], day: String(s.day).padStart(2, "0") } : { month: "", day: "" };
}

/**
 * Today's date in the audience's timezone (default IST), so a post dated
 * the 16th goes live at midnight in India rather than at 05:30 when UTC
 * catches up. en-CA formats as yyyy-MM-dd.
 */
function todayIso() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.CONTENT_TIMEZONE || "Asia/Kolkata",
  }).format(new Date());
}

module.exports = {
  CONTENT_STATUSES,
  EVENT_MODES,
  THEMES,
  isUuid,
  slugify,
  uniqueSlug,
  str,
  nullableStr,
  strList,
  oneOf,
  dateOnly,
  imageUrl,
  faqList,
  richText,
  isEmptyHtml,
  readTimeFromHtml,
  withHeadingIds,
  dateLabel,
  eventDateLabel,
  monthDay,
  todayIso,
};

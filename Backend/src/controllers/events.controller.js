const { Op } = require("sequelize");
const { Event, sequelize } = require("../models");
const content = require("../utils/content");

function serializeEvent(event) {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    tagline: event.tagline,
    type: event.type,
    mode: event.mode,
    location: event.location,
    startDate: event.startDate,
    endDate: event.endDate,
    timeLabel: event.timeLabel,
    theme: event.theme,
    coverImage: event.coverImage,
    aboutHtml: event.aboutHtml,
    agenda: event.agenda || [],
    takeaways: event.takeaways || [],
    audience: event.audience || [],
    poster: normalizePoster(event.poster),
    instructor: normalizeInstructor(event.instructor),
    priceLabel: event.priceLabel,
    certificateLabel: event.certificateLabel,
    metaTitle: event.metaTitle,
    metaDescription: event.metaDescription,
    status: event.status,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  };
}

function normalizePoster(value) {
  const v = value || {};
  return {
    ribbon: content.str(v.ribbon, 120),
    title: content.str(v.title, 200),
    subtitle: content.str(v.subtitle, 300),
    badgeText: content.str(v.badgeText, 60),
    badgeType: content.str(v.badgeType, 60),
  };
}

function normalizeInstructor(value) {
  const v = value || {};
  return {
    name: content.str(v.name, 255),
    role: content.str(v.role, 255),
    bio: content.str(v.bio, 3000),
    avatar: content.imageUrl(v.avatar),
    highlights: content.strList(v.highlights, { max: 8, maxLength: 60 }),
  };
}

function agendaList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((slot) => ({ time: content.str(slot?.time, 60), item: content.str(slot?.item, 500) }))
    .filter((slot) => slot.item)
    .slice(0, 40);
}

const FIELD_READERS = {
  title: (v) => content.str(v, 255),
  tagline: (v) => content.str(v, 1000),
  type: (v) => content.str(v, 60) || "Workshop",
  mode: (v) => content.oneOf(v, content.EVENT_MODES, "Online"),
  location: (v) => content.str(v, 255),
  startDate: (v) => content.dateOnly(v),
  endDate: (v) => content.dateOnly(v),
  timeLabel: (v) => content.str(v, 120),
  theme: (v) => content.oneOf(v, content.THEMES, "indigo"),
  coverImage: (v) => content.imageUrl(v),
  aboutHtml: (v) => content.richText(v),
  agenda: agendaList,
  takeaways: (v) => content.strList(v, { max: 20 }),
  audience: (v) => content.strList(v, { max: 20 }),
  poster: normalizePoster,
  instructor: normalizeInstructor,
  priceLabel: (v) => content.str(v, 120),
  certificateLabel: (v) => content.str(v, 120),
  metaTitle: (v) => content.nullableStr(v, 255),
  metaDescription: (v) => content.nullableStr(v, 1000),
  status: (v) => content.oneOf(v, content.CONTENT_STATUSES, "Draft"),
};

function readEventInput(body) {
  const input = {};
  for (const [key, read] of Object.entries(FIELD_READERS)) {
    if (Object.prototype.hasOwnProperty.call(body, key)) input[key] = read(body[key]);
  }
  return input;
}

function validate(event) {
  if (event.startDate && event.endDate && event.endDate < event.startDate) {
    return "The end date can't be before the start date.";
  }
  if (event.status !== "Published") return null;

  const missing = [];
  if (!event.title) missing.push("a title");
  if (!event.tagline) missing.push("a tagline");
  if (!event.startDate) missing.push("a start date");
  if (!event.timeLabel) missing.push("a time");
  if (!event.location) missing.push("a location");
  return missing.length ? `Can't publish yet — add ${missing.join(", ")}.` : null;
}

function findEvent(id) {
  return content.isUuid(id) ? Event.findByPk(id) : null;
}

async function list(req, res) {
  const events = await Event.findAll({
    order: [
      ["startDate", "DESC NULLS FIRST"],
      ["updatedAt", "DESC"],
    ],
  });
  res.json({ events: events.map(serializeEvent) });
}

async function get(req, res) {
  const event = await findEvent(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ event: serializeEvent(event) });
}

async function create(req, res) {
  const input = readEventInput(req.body || {});

  const problem = validate(input);
  if (problem) return res.status(400).json({ message: problem });

  const event = await Event.create({
    ...input,
    slug: await content.uniqueSlug(Event, req.body?.slug || input.title),
    createdById: req.user.id,
    updatedById: req.user.id,
  });

  res.status(201).json({ event: serializeEvent(event) });
}

async function update(req, res) {
  const event = await findEvent(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const input = readEventInput(req.body || {});

  const problem = validate({ ...serializeEvent(event), ...input });
  if (problem) return res.status(400).json({ message: problem });

  const requestedSlug = content.slugify(req.body?.slug);
  if (requestedSlug && requestedSlug !== event.slug) {
    input.slug = await content.uniqueSlug(Event, requestedSlug, event.id);
  }

  await event.update({ ...input, updatedById: req.user.id });
  res.json({ event: serializeEvent(event) });
}

async function remove(req, res) {
  const event = await findEvent(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  await event.destroy();
  res.status(204).end();
}

// ── Public (landing site) ────────────────────────────────────────────

function serializePublicEvent(event, { detail = false } = {}) {
  const { month, day } = content.monthDay(event.startDate);
  const out = {
    slug: event.slug,
    title: event.title,
    tagline: event.tagline,
    type: event.type,
    mode: event.mode,
    location: event.location,
    startDate: event.startDate,
    endDate: event.endDate,
    month,
    day,
    dateLabel: content.eventDateLabel(event.startDate, event.endDate),
    time: event.timeLabel,
    theme: event.theme,
    coverImage: event.coverImage,
    poster: normalizePoster(event.poster),
    instructor: normalizeInstructor(event.instructor),
    priceLabel: event.priceLabel,
    certificateLabel: event.certificateLabel,
    metaTitle: event.metaTitle || event.title,
    metaDescription: event.metaDescription || event.tagline,
  };

  if (detail) {
    out.aboutHtml = event.aboutHtml;
    out.agenda = event.agenda || [];
    out.takeaways = event.takeaways || [];
    out.audience = event.audience || [];
  }

  return out;
}

const lastDay = () => sequelize.fn("COALESCE", sequelize.col("end_date"), sequelize.col("start_date"));

// GET /api/public/events?when=upcoming|past
async function publicList(req, res) {
  const when = content.oneOf(req.query.when, ["upcoming", "past"], null);
  const today = content.todayIso();
  const where = { status: "Published", startDate: { [Op.ne]: null } };

  if (when === "upcoming") where[Op.and] = [sequelize.where(lastDay(), Op.gte, today)];
  if (when === "past") where[Op.and] = [sequelize.where(lastDay(), Op.lt, today)];

  const events = await Event.findAll({
    where,
    attributes: { exclude: ["aboutHtml", "agenda", "takeaways", "audience"] },
    order: [["startDate", when === "past" ? "DESC" : "ASC"]],
  });

  res.json({ events: events.map((event) => serializePublicEvent(event)) });
}

async function publicGet(req, res) {
  const event = await Event.findOne({
    where: { slug: String(req.params.slug), status: "Published" },
  });
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ event: serializePublicEvent(event, { detail: true }) });
}

module.exports = { list, get, create, update, remove, publicList, publicGet };

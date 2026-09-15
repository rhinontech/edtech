const { Op } = require("sequelize");
const { Blog } = require("../models");
const content = require("../utils/content");

function serializeBlog(blog) {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    category: blog.category,
    theme: blog.theme,
    coverImage: blog.coverImage,
    contentHtml: blog.contentHtml,
    faqs: blog.faqs || [],
    tags: blog.tags || [],
    readTime: blog.readTime,
    authorName: blog.authorName,
    authorRole: blog.authorRole,
    authorAvatar: blog.authorAvatar,
    metaTitle: blog.metaTitle,
    metaDescription: blog.metaDescription,
    status: blog.status,
    publishDate: blog.publishDate,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
}

// Only fields present in the body are returned, so PATCH can send a subset.
const FIELD_READERS = {
  title: (v) => content.str(v, 255),
  excerpt: (v) => content.str(v, 1000),
  category: (v) => content.nullableStr(v, 255),
  theme: (v) => content.oneOf(v, content.THEMES, "indigo"),
  coverImage: (v) => content.imageUrl(v),
  contentHtml: (v) => content.richText(v),
  faqs: (v) => content.faqList(v),
  tags: (v) => content.strList(v, { max: 20, maxLength: 60 }),
  readTime: (v) => content.str(v, 40),
  authorName: (v) => content.str(v, 255),
  authorRole: (v) => content.str(v, 255),
  authorAvatar: (v) => content.imageUrl(v),
  metaTitle: (v) => content.nullableStr(v, 255),
  metaDescription: (v) => content.nullableStr(v, 1000),
  status: (v) => content.oneOf(v, content.CONTENT_STATUSES, "Draft"),
  publishDate: (v) => content.dateOnly(v),
};

function readBlogInput(body) {
  const input = {};
  for (const [key, read] of Object.entries(FIELD_READERS)) {
    if (Object.prototype.hasOwnProperty.call(body, key)) input[key] = read(body[key]);
  }
  if ("publishDate" in input && !input.publishDate) delete input.publishDate;
  if ("authorName" in input && !input.authorName) input.authorName = "UpperCurve Editorial";
  return input;
}

/** Drafts can be half-written; publishing needs what the site actually renders. */
function publishProblems(blog) {
  const missing = [];
  if (!blog.title) missing.push("a title");
  if (!blog.excerpt) missing.push("an excerpt");
  if (content.isEmptyHtml(blog.contentHtml)) missing.push("some body content");
  return missing.length ? `Can't publish yet — add ${missing.join(", ")}.` : null;
}

function findBlog(id) {
  return content.isUuid(id) ? Blog.findByPk(id) : null;
}

async function list(req, res) {
  const blogs = await Blog.findAll({
    order: [
      ["publishDate", "DESC"],
      ["updatedAt", "DESC"],
    ],
  });
  res.json({ blogs: blogs.map(serializeBlog) });
}

async function get(req, res) {
  const blog = await findBlog(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog post not found" });
  res.json({ blog: serializeBlog(blog) });
}

async function create(req, res) {
  const input = readBlogInput(req.body || {});
  if (!input.readTime) input.readTime = content.readTimeFromHtml(input.contentHtml);

  const problem = input.status === "Published" ? publishProblems(input) : null;
  if (problem) return res.status(400).json({ message: problem });

  const blog = await Blog.create({
    ...input,
    slug: await content.uniqueSlug(Blog, req.body?.slug || input.title),
    createdById: req.user.id,
    updatedById: req.user.id,
  });

  res.status(201).json({ blog: serializeBlog(blog) });
}

async function update(req, res) {
  const blog = await findBlog(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog post not found" });

  const input = readBlogInput(req.body || {});
  if ("readTime" in input && !input.readTime) {
    input.readTime = content.readTimeFromHtml(input.contentHtml ?? blog.contentHtml);
  }

  const next = { ...serializeBlog(blog), ...input };
  const problem = next.status === "Published" ? publishProblems(next) : null;
  if (problem) return res.status(400).json({ message: problem });

  const requestedSlug = content.slugify(req.body?.slug);
  if (requestedSlug && requestedSlug !== blog.slug) {
    input.slug = await content.uniqueSlug(Blog, requestedSlug, blog.id);
  }

  await blog.update({ ...input, updatedById: req.user.id });
  res.json({ blog: serializeBlog(blog) });
}

async function remove(req, res) {
  const blog = await findBlog(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog post not found" });
  await blog.destroy();
  res.status(204).end();
}

// ── Public (landing site) ────────────────────────────────────────────

function publicWhere(extra = {}) {
  return {
    status: "Published",
    // Posts dated in the future stay hidden until their day arrives.
    publishDate: { [Op.lte]: content.todayIso() },
    ...extra,
  };
}

function serializePublicBlog(blog, { detail = false } = {}) {
  const out = {
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    category: blog.category,
    theme: blog.theme,
    coverImage: blog.coverImage,
    tags: blog.tags || [],
    readTime: blog.readTime,
    author: { name: blog.authorName, role: blog.authorRole, avatar: blog.authorAvatar },
    dateISO: blog.publishDate,
    dateLabel: content.dateLabel(blog.publishDate),
    metaTitle: blog.metaTitle || blog.title,
    metaDescription: blog.metaDescription || blog.excerpt,
  };

  if (detail) {
    const { html, toc } = content.withHeadingIds(blog.contentHtml);
    out.contentHtml = html;
    out.toc = toc;
    out.faqs = blog.faqs || [];
  }

  return out;
}

async function publicList(req, res) {
  const category = content.str(req.query.category, 255);
  const blogs = await Blog.findAll({
    where: publicWhere(category ? { category } : {}),
    attributes: { exclude: ["contentHtml", "faqs"] },
    order: [
      ["publishDate", "DESC"],
      ["createdAt", "DESC"],
    ],
  });
  res.json({ blogs: blogs.map((blog) => serializePublicBlog(blog)) });
}

async function publicGet(req, res) {
  const blog = await Blog.findOne({ where: publicWhere({ slug: String(req.params.slug) }) });
  if (!blog) return res.status(404).json({ message: "Blog post not found" });
  res.json({ blog: serializePublicBlog(blog, { detail: true }) });
}

module.exports = { list, get, create, update, remove, publicList, publicGet };

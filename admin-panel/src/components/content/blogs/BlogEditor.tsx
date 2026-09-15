"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BLOG_CATEGORIES,
  formatDateLabel,
  readTimeFromHtml,
  slugify,
  themeOf,
  type BlogInput,
  type BlogPost,
} from "@/lib/content";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { contentApi } from "../api";
import { EditorShell, useContentDocument, type EditorTab } from "../EditorShell";
import { Field, RailCard, SectionCard, SeoFields, SlugField, ThemePicker, fieldClass } from "../fields";
import { ImageInput } from "../ImageInput";
import { ChipListEditor, FaqEditor } from "../ListEditors";
import { RichTextEditor } from "../editor/RichTextEditor";
import { BlogArticle, BlogCard, BlogPoster, BrowserFrame } from "../site/BlogSite";

function toInput(post: BlogPost): BlogInput {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, updatedAt, ...input } = post;
  return input;
}

function blankPost(today: string): BlogInput {
  return {
    slug: "",
    title: "",
    excerpt: "",
    category: null,
    theme: "indigo",
    coverImage: null,
    contentHtml: "",
    faqs: [],
    tags: [],
    readTime: "1 min read",
    authorName: "UpperCurve Editorial",
    authorRole: "",
    authorAvatar: null,
    metaTitle: null,
    metaDescription: null,
    status: "Draft",
    publishDate: today,
  };
}

/** Typing the slug by hand: keep it URL-safe but allow a trailing hyphen mid-typing. */
function looseSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export function BlogEditor({
  post,
  basePath,
  siteUrl,
  today,
  categories,
}: {
  post?: BlogPost;
  basePath: string;
  siteUrl: string;
  today: string;
  /** Categories already used by other posts, offered alongside the site's defaults. */
  categories: string[];
}) {
  const [tab, setTab] = useState<EditorTab>("edit");
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [readTimeAuto, setReadTimeAuto] = useState(
    () => !post || post.readTime === readTimeFromHtml(post.contentHtml)
  );

  const { doc, patch, save, saving, savedStatus, savedSlug, hasUnsaved, destroy } = useContentDocument<BlogInput, BlogPost>({
    initial: post ? toInput(post) : blankPost(today),
    id: post?.id,
    create: (input) => contentApi.createBlog(input),
    update: (id, input) => contentApi.updateBlog(id, input),
    remove: (id) => contentApi.deleteBlog(id),
    editHref: (id) => `${basePath}/${id}`,
    listHref: basePath,
    noun: "Post",
  });

  const theme = themeOf(doc.theme);
  const siteHost = siteUrl.replace(/^https?:\/\//, "");
  const publicPath = `/blog/${doc.slug || slugify(doc.title) || "your-post-url"}`;
  const isLive = !!post && savedStatus === "Published" && savedSlug && doc.publishDate <= today;
  const scheduled = !!post && savedStatus === "Published" && doc.publishDate > today;
  const categoryOptions = Array.from(new Set([...BLOG_CATEGORIES, ...categories]));

  function setTitle(title: string) {
    patch(slugTouched ? { title } : { title, slug: slugify(title) });
  }

  function setContent(contentHtml: string) {
    patch(readTimeAuto ? { contentHtml, readTime: readTimeFromHtml(contentHtml) } : { contentHtml });
  }

  return (
    <EditorShell
      noun="post"
      listHref={basePath}
      listLabel="Blogs"
      title={doc.title}
      isNew={!post}
      savedStatus={savedStatus}
      statusNote={scheduled ? `Scheduled · ${formatDateLabel(doc.publishDate)}` : null}
      hasUnsaved={hasUnsaved}
      saving={saving}
      liveUrl={isLive ? `${siteUrl}/blog/${savedSlug}` : null}
      publicUrl={`${siteUrl}${publicPath}`}
      tab={tab}
      onTabChange={setTab}
      onSave={save}
      onDelete={destroy}
    >
      {tab === "preview" ? (
        <div className="mx-auto max-w-7xl space-y-10">
          <div>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Article page</div>
            <BrowserFrame url={`${siteHost}${publicPath}`}>
              <BlogArticle post={doc} siteUrl={siteUrl} />
            </BrowserFrame>
          </div>
          <div>
            <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Card on /blog</div>
            <div className="uc-site max-w-sm">
              <BlogCard post={doc} siteUrl={siteUrl} />
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            {/* Headline block, typeset like the top of the article page. */}
            <section className="uc-site rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm sm:p-10">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className={cn(theme.chip, "rounded-full border px-3 py-1 text-[11px] font-semibold")}>
                  {doc.category || "No category"}
                </span>
                <span className="rounded-full border border-gray-200/70 bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-700">
                  {doc.readTime}
                </span>
              </div>
              <textarea
                value={doc.title}
                onChange={(e) => setTitle(e.target.value.replace(/\n/g, " "))}
                placeholder="Post title"
                rows={1}
                className="field-sizing-content w-full resize-none bg-transparent text-4xl font-black leading-[1.08] tracking-tight text-gray-900 outline-none placeholder:text-gray-300 sm:text-5xl"
              />
              <textarea
                value={doc.excerpt}
                onChange={(e) => patch({ excerpt: e.target.value })}
                placeholder="One or two sentences for the blog card and the top of the article."
                rows={2}
                className="field-sizing-content mt-4 w-full resize-none bg-transparent leading-relaxed text-gray-500 outline-none placeholder:text-gray-300"
              />
              <div className="mt-3 text-xs font-semibold text-gray-400">
                Published {formatDateLabel(doc.publishDate) || "—"} · {doc.authorName || "UpperCurve Editorial"}
              </div>
            </section>

            <RichTextEditor
              initialHtml={doc.contentHtml}
              onChange={setContent}
              folder="blogs"
              placeholder="Write the article… Use “Heading (in contents)” for sections — they build the “In this article” list."
            />

            <SectionCard
              title="FAQs"
              description="Optional. Shown under the article and useful for search results."
            >
              <FaqEditor faqs={doc.faqs} onChange={(faqs) => patch({ faqs })} />
            </SectionCard>
          </div>

          <aside className="space-y-4">
            <RailCard title="Publishing">
              <SlugField
                prefix="/blog/"
                value={doc.slug}
                onChange={(value) => {
                  setSlugTouched(true);
                  patch({ slug: looseSlug(value) });
                }}
                warning={
                  savedStatus === "Published" && post && doc.slug && doc.slug !== savedSlug
                    ? "This post is live — changing its URL breaks existing links to it."
                    : null
                }
              />
              <Field
                label="Publish date"
                group
                hint={doc.publishDate > today ? "Future date — the post goes live on this day once published." : undefined}
              >
                <DatePicker
                  value={doc.publishDate}
                  onChange={(value) => patch({ publishDate: value || today })}
                  className={cn(fieldClass, "focus:ring-3 focus:ring-blue-100")}
                />
              </Field>
              <Field
                label="Read time"
                aside={
                  !readTimeAuto && (
                    <button
                      type="button"
                      onClick={() => {
                        setReadTimeAuto(true);
                        patch({ readTime: readTimeFromHtml(doc.contentHtml) });
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-500 hover:bg-gray-50"
                    >
                      <Sparkles className="size-3" /> Auto
                    </button>
                  )
                }
                hint={readTimeAuto ? "Calculated from the article length." : undefined}
              >
                <Input
                  value={doc.readTime}
                  onChange={(e) => {
                    setReadTimeAuto(false);
                    patch({ readTime: e.target.value });
                  }}
                  className={fieldClass}
                />
              </Field>
            </RailCard>

            <RailCard title="Thumbnail">
              <ImageInput
                value={doc.coverImage}
                onChange={(coverImage) => patch({ coverImage })}
                folder="blogs"
                siteUrl={siteUrl}
                emptyLabel="Upload a thumbnail (16:10)"
              />
              <Field label="Poster colour" group hint="Used for the generated poster when there's no thumbnail.">
                <ThemePicker value={doc.theme} onChange={(value) => patch({ theme: value })} />
              </Field>
              {!doc.coverImage && (
                <div className="uc-site aspect-[16/10] overflow-hidden rounded-2xl">
                  <BlogPoster post={doc} siteUrl={siteUrl} />
                </div>
              )}
            </RailCard>

            <RailCard title="Organise">
              <Field label="Category">
                <Input
                  list="blog-categories"
                  value={doc.category || ""}
                  onChange={(e) => patch({ category: e.target.value || null })}
                  placeholder="e.g. Careers & Interviews"
                  className={fieldClass}
                />
                <datalist id="blog-categories">
                  {categoryOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Tags" group hint="Press Enter after each tag.">
                <ChipListEditor items={doc.tags} onChange={(tags) => patch({ tags })} placeholder="AI, interviews…" max={20} />
              </Field>
            </RailCard>

            <RailCard title="Author">
              <div className="flex items-start gap-3">
                <ImageInput
                  value={doc.authorAvatar}
                  onChange={(authorAvatar) => patch({ authorAvatar })}
                  folder="blogs"
                  siteUrl={siteUrl}
                  compact
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <Input
                    value={doc.authorName}
                    onChange={(e) => patch({ authorName: e.target.value })}
                    placeholder="Name"
                    aria-label="Author name"
                    className={cn(fieldClass, "h-9")}
                  />
                  <Input
                    value={doc.authorRole}
                    onChange={(e) => patch({ authorRole: e.target.value })}
                    placeholder="Role (optional)"
                    aria-label="Author role"
                    className={cn(fieldClass, "h-9")}
                  />
                </div>
              </div>
            </RailCard>

            <RailCard title="SEO">
              <SeoFields
                metaTitle={doc.metaTitle || ""}
                metaDescription={doc.metaDescription || ""}
                onMetaTitle={(value) => patch({ metaTitle: value || null })}
                onMetaDescription={(value) => patch({ metaDescription: value || null })}
                fallbackTitle={doc.title ? `${doc.title} — UpperCurve Blog` : ""}
                fallbackDescription={doc.excerpt}
                url={`${siteHost} › blog › ${doc.slug || "…"}`}
              />
            </RailCard>
          </aside>
        </div>
      )}
    </EditorShell>
  );
}

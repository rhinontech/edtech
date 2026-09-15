"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import {
  BLOG_CATEGORIES,
  formatDateLabel,
  readTimeFromHtml,
  slugify,
  type BlogInput,
  type BlogPost,
} from "@/lib/content";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { contentApi } from "../api";
import { EditorColumns, EditorShell, useContentDocument, type EditorTab } from "../EditorShell";
import { Field, RailSection, Section, SeoFields, SlugField, ThemePicker, fieldClass } from "../fields";
import { ImageInput } from "../ImageInput";
import { ChipListEditor, FaqEditor, FaqJsonButton } from "../ListEditors";
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
      statusNote={scheduled ? `Scheduled for ${formatDateLabel(doc.publishDate)}` : null}
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
        <div className="mx-auto max-w-7xl space-y-10 px-5 py-10 md:px-10">
          <div>
            <div className="mb-3 text-xs font-medium text-gray-500">Article page</div>
            <BrowserFrame url={`${siteHost}${publicPath}`}>
              <BlogArticle post={doc} siteUrl={siteUrl} />
            </BrowserFrame>
          </div>
          <div>
            <div className="mb-3 text-xs font-medium text-gray-500">Card on the blog</div>
            <div className="uc-site max-w-sm">
              <BlogCard post={doc} siteUrl={siteUrl} />
            </div>
          </div>
        </div>
      ) : (
        <EditorColumns
          main={
            <div className="space-y-10">
              <div>
                <div className="mb-4 flex items-center gap-2 text-xs text-gray-400">
                  <span>{doc.category || "Uncategorised"}</span>
                  <span>·</span>
                  <span>{doc.readTime}</span>
                  <span>·</span>
                  <span>{formatDateLabel(doc.publishDate)}</span>
                </div>
                <textarea
                  value={doc.title}
                  onChange={(e) => setTitle(e.target.value.replace(/\n/g, " "))}
                  placeholder="Post title"
                  aria-label="Title"
                  rows={1}
                  className="field-sizing-content w-full resize-none bg-transparent text-[40px] font-semibold leading-[1.1] tracking-[-0.03em] text-gray-900 outline-none placeholder:text-gray-300"
                />
                <textarea
                  value={doc.excerpt}
                  onChange={(e) => patch({ excerpt: e.target.value })}
                  placeholder="Write a short excerpt — it appears on the blog card and under the title."
                  aria-label="Excerpt"
                  rows={1}
                  className="field-sizing-content mt-3 w-full resize-none bg-transparent text-lg leading-relaxed text-gray-500 outline-none placeholder:text-gray-300"
                />
              </div>

              <RichTextEditor
                initialHtml={doc.contentHtml}
                onChange={setContent}
                folder="blogs"
                placeholder="Start writing… Use “Heading (in contents)” for sections — they build the article's table of contents."
              />

              <Section
                title="FAQs"
                description="Optional. Shown below the article and helpful in search results."
                action={<FaqJsonButton faqs={doc.faqs} onChange={(faqs) => patch({ faqs })} />}
              >
                <FaqEditor faqs={doc.faqs} onChange={(faqs) => patch({ faqs })} />
              </Section>
            </div>
          }
          rail={
            <>
              <RailSection title="Publishing">
                <SlugField
                  prefix="/blog/"
                  value={doc.slug}
                  onChange={(value) => {
                    setSlugTouched(true);
                    patch({ slug: looseSlug(value) });
                  }}
                  warning={
                    savedStatus === "Published" && post && doc.slug && doc.slug !== savedSlug
                      ? "This post is live — changing its URL breaks existing links."
                      : null
                  }
                />
                <Field label="Publish date" group>
                  <DatePicker
                    value={doc.publishDate}
                    onChange={(value) => patch({ publishDate: value || today })}
                    className={fieldClass}
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
                        className="inline-flex items-center gap-0.5 text-[11px] text-indigo-600 hover:text-indigo-700"
                      >
                        <Sparkles className="size-3" /> Auto
                      </button>
                    )
                  }
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
                {doc.publishDate > today && (
                  <p className="text-xs text-gray-400">Future date — once published, the post goes live on that day.</p>
                )}
              </RailSection>

              <RailSection title="Thumbnail">
                <ImageInput
                  value={doc.coverImage}
                  onChange={(coverImage) => patch({ coverImage })}
                  folder="blogs"
                  siteUrl={siteUrl}
                  emptyLabel="Upload a 16:10 image"
                />
                {!doc.coverImage && (
                  <Field label="Or use a generated poster" group>
                    <div className="uc-site mb-3 aspect-16/10 overflow-hidden rounded-lg">
                      <BlogPoster post={doc} siteUrl={siteUrl} />
                    </div>
                    <ThemePicker value={doc.theme} onChange={(value) => patch({ theme: value })} />
                  </Field>
                )}
              </RailSection>

              <RailSection title="Organise">
                <Field label="Category">
                  <Input
                    list="blog-categories"
                    value={doc.category || ""}
                    onChange={(e) => patch({ category: e.target.value || null })}
                    placeholder="Choose or type a category"
                    className={fieldClass}
                  />
                  <datalist id="blog-categories">
                    {categoryOptions.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </Field>
                <Field label="Tags" group>
                  <ChipListEditor items={doc.tags} onChange={(tags) => patch({ tags })} placeholder="Add a tag and press Enter" max={20} />
                </Field>
              </RailSection>

              <RailSection title="Author">
                <div className="flex items-center gap-3">
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
                      className={fieldClass}
                    />
                    <Input
                      value={doc.authorRole}
                      onChange={(e) => patch({ authorRole: e.target.value })}
                      placeholder="Role (optional)"
                      aria-label="Author role"
                      className={fieldClass}
                    />
                  </div>
                </div>
              </RailSection>

              <RailSection title="Search engine">
                <SeoFields
                  metaTitle={doc.metaTitle || ""}
                  metaDescription={doc.metaDescription || ""}
                  onMetaTitle={(value) => patch({ metaTitle: value || null })}
                  onMetaDescription={(value) => patch({ metaDescription: value || null })}
                  fallbackTitle={doc.title ? `${doc.title} — UpperCurve Blog` : ""}
                  fallbackDescription={doc.excerpt}
                  url={`${siteHost} › blog › ${doc.slug || "…"}`}
                />
              </RailSection>
            </>
          }
        />
      )}
    </EditorShell>
  );
}

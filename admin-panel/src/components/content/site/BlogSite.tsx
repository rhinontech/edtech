/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  extractHeadings,
  formatDateLabel,
  isEmptyHtml,
  resolveAsset,
  slugify,
  themeOf,
  type BlogInput,
} from "@/lib/content";

// Replicas of uppercurve/components/Pages/Blog/* (BlogPoster, BlogExplorer
// card, BlogDetails). Class names are kept identical to the site so the admin
// previews match what visitors see — update both when the site changes.

type PosterData = Pick<BlogInput, "title" | "category" | "theme" | "coverImage" | "publishDate" | "readTime">;

export function BlogPoster({ post, featured = false, siteUrl }: { post: PosterData; featured?: boolean; siteUrl: string }) {
  const theme = themeOf(post.theme);
  const cover = resolveAsset(post.coverImage, siteUrl);

  if (cover) {
    return <img src={cover} alt="" className="h-full w-full object-cover" />;
  }

  return (
    <div className={`relative overflow-hidden h-full w-full ${theme.gradient}`}>
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:14px_14px] opacity-25" />
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-black/40 blur-3xl" />

      <div className={`relative z-10 h-full flex flex-col justify-between ${featured ? "p-8" : "p-6"}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 [font-family:var(--font-montserrat)]">
            UpperCurve Blog
          </span>
          {post.category && (
            <span className="bg-white/15 border border-white/25 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
              {post.category}
            </span>
          )}
        </div>

        <div>
          <div
            className={`text-white font-black tracking-tight leading-[1.08] ${
              featured ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl"
            }`}
          >
            {post.title || "Untitled post"}
          </div>
          <div className="mt-3 text-xs font-semibold text-white/75 tracking-wide">
            {formatDateLabel(post.publishDate)} · {post.readTime}
          </div>
        </div>
      </div>
    </div>
  );
}

type CardData = PosterData & Pick<BlogInput, "excerpt">;

/**
 * The "Discover our posts" grid card. `badge` and `footerAction` are admin
 * additions; `href` becomes a stretched link so footer buttons stay valid
 * (no buttons nested inside an anchor) and clickable above it.
 */
export function BlogCard({
  post,
  siteUrl,
  href,
  badge,
  footerAction,
}: {
  post: CardData;
  siteUrl: string;
  href?: string;
  badge?: React.ReactNode;
  footerAction?: React.ReactNode;
}) {
  const theme = themeOf(post.theme);
  const className =
    "group relative flex flex-col bg-white rounded-3xl border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden";

  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
          <BlogPoster post={post} siteUrl={siteUrl} />
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        {(badge || post.category) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {badge}
            {post.category && (
              <span className={`${theme.chip} border text-[11px] font-semibold px-3 py-1 rounded-full`}>
                {post.category}
              </span>
            )}
          </div>
        )}
        <h3 className="text-xl font-black text-gray-900 tracking-tight leading-snug mb-2.5">
          {post.title || "Untitled post"}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-5 line-clamp-3">
          {post.excerpt || <span className="italic text-gray-400">No excerpt yet</span>}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500">
          <span>
            {formatDateLabel(post.publishDate)} · {post.readTime}
          </span>
          {footerAction ?? (
            <span className="text-sm font-bold text-gray-900 inline-flex items-center gap-1.5">
              Read
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={className}>
      {href && <Link href={href} className="absolute inset-0 z-20 rounded-3xl" aria-label={`Open ${post.title || "post"}`} />}
      {inner}
    </div>
  );
}

/** Adds the same heading ids the public API adds, so TOC links work in preview. */
function withHeadingIds(html: string) {
  return html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs: string, inner: string) => {
    const id = slugify(inner.replace(/<[^>]*>/g, " "));
    return id ? `<h2 id="preview-${id}"${attrs}>${inner}</h2>` : match;
  });
}

/** BlogDetails, minus the site-wide "More articles" strip. */
export function BlogArticle({ post, siteUrl }: { post: BlogInput; siteUrl: string }) {
  const theme = themeOf(post.theme);
  const headings = extractHeadings(post.contentHtml);
  const faqs = post.faqs.filter((f) => f.question.trim() && f.answer.trim());
  const avatar = resolveAsset(post.authorAvatar, siteUrl);

  return (
    <main className="uc-site min-h-full bg-white flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto px-5 md:px-6 pt-8 pb-24">
        <span className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 mb-6">← All articles</span>

        <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200/60 h-[300px] sm:h-[380px] md:h-[420px] mb-10">
          <BlogPoster post={post} featured siteUrl={siteUrl} />
        </div>

        <div className="max-w-3xl mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {post.category && (
              <span className={`${theme.chip} border text-[11px] font-semibold px-3 py-1 rounded-full`}>
                {post.category}
              </span>
            )}
            <span className="bg-gray-100 border-gray-200/70 text-gray-700 border text-[11px] font-semibold px-3 py-1 rounded-full">
              {post.readTime}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[1.08] mb-5">
            {post.title || "Untitled post"}
          </h1>
          {post.excerpt && <p className="text-gray-500 text-md leading-relaxed mb-4">{post.excerpt}</p>}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            {avatar && <img src={avatar} alt="" className="h-6 w-6 rounded-full object-cover" />}
            <span>
              Published {formatDateLabel(post.publishDate)} · {post.authorName || "UpperCurve Editorial"}
              {post.authorRole ? `, ${post.authorRole}` : ""}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <article className="lg:col-span-8 max-w-2xl">
            {isEmptyHtml(post.contentHtml) ? (
              <p className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
                The article body will appear here.
              </p>
            ) : (
              <div className="uc-article" dangerouslySetInnerHTML={{ __html: withHeadingIds(post.contentHtml) }} />
            )}

            {faqs.length > 0 && (
              <div className="mt-14">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-5">
                  Frequently asked questions
                </h2>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <details key={i} className="group rounded-2xl border border-gray-200/80 bg-white px-5 py-4 shadow-sm" open={i === 0}>
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-bold text-gray-900">
                        {faq.question}
                        <span className="text-gray-400 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </article>

          <aside className="lg:col-span-4 lg:sticky lg:top-24 max-lg:hidden">
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6">
              <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">In this article</div>
              <div className="space-y-1">
                {headings.length === 0 && (
                  <p className="px-3 py-2 text-xs text-gray-400">Headings you add show up here.</p>
                )}
                {headings.map((heading, i) => (
                  <a
                    key={`${heading.id}-${i}`}
                    href={`#preview-${heading.id}`}
                    className="block text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors"
                  >
                    {heading.text}
                  </a>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <span className="block text-center bg-gray-100 text-gray-900 text-sm font-semibold px-5 py-3 rounded-full shadow-sm">
                  Join our next event →
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/** Browser chrome around a preview, showing the public URL. */
export function BrowserFrame({ url, children, className }: { url: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]", className)}>
      <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/80 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded-full bg-white px-4 py-1 text-center text-xs font-medium text-gray-500 ring-1 ring-gray-200/80">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}

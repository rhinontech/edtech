import React from "react";
import Link from "next/link";
import { BlogPost, blogPosts, ContentBlock, slugifyHeading } from "../blogData";
import BlogPoster from "../BlogPoster";

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          id={slugifyHeading(block.text)}
          className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight pt-6 scroll-mt-24"
        >
          {block.text}
        </h2>
      );
    case "p":
      return <p className="text-[15px] text-gray-600 leading-relaxed">{block.text}</p>;
    case "list":
      return (
        <ul className="space-y-3">
          {block.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-[15px] font-medium text-gray-800">
              <span className="mt-0.5 w-5 h-5 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="bg-gray-50 border-l-4 border-indigo-600 rounded-r-2xl px-6 py-5 text-md font-bold text-gray-900 tracking-tight leading-relaxed">
          “{block.text}”
        </blockquote>
      );
  }
}

export function BlogDetails({ post }: { post: BlogPost }) {
  const headings = post.content.filter(
    (block): block is Extract<ContentBlock, { type: "h2" }> => block.type === "h2"
  );
  const morePosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-6xl mx-auto px-5 md:px-6 pt-8 pb-24">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          ← All articles
        </Link>

        {/* Poster hero */}
        <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200/60 h-[300px] sm:h-[380px] md:h-[420px] mb-10">
          <BlogPoster post={post} featured />
        </div>

        {/* Title */}
        <div className="max-w-3xl mb-12">
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className={`${post.chip} border text-[11px] font-semibold px-3 py-1 rounded-full`}>
              {post.category}
            </span>
            <span className="bg-gray-100 border-gray-200/70 text-gray-700 border text-[11px] font-semibold px-3 py-1 rounded-full">
              {post.readTime}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[1.08] mb-5">
            {post.title}
          </h1>
          <p className="text-gray-500 text-md leading-relaxed mb-4">{post.excerpt}</p>
          <div className="text-xs font-semibold text-gray-400">
            Published {post.dateLabel} · UpperCurve Editorial
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Article body */}
          <article className="lg:col-span-8 space-y-6 max-w-2xl">
            {post.content.map((block, idx) => (
              <Block key={idx} block={block} />
            ))}
          </article>

          {/* Sticky TOC */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 max-lg:hidden">
            <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm p-6">
              <div className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">
                In this article
              </div>
              <div className="space-y-1">
                {headings.map((heading) => (
                  <a
                    key={heading.text}
                    href={`#${slugifyHeading(heading.text)}`}
                    className="block text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors"
                  >
                    {heading.text}
                  </a>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <Link
                  href="/events"
                  className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-semibold px-5 py-3 rounded-full transition-all duration-200 active:scale-95 shadow-sm"
                >
                  Join our next event →
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* More articles */}
        <div className="mt-20 pt-10 border-t border-gray-100">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              More articles
            </h2>
            <Link
              href="/blog"
              className="text-sm font-bold text-gray-900 hover:text-black inline-flex items-center gap-1.5"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {morePosts.map((other) => (
              <Link
                key={other.slug}
                href={`/blog/${other.slug}`}
                className="group bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-md transition-all p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`${other.chip} border text-[10px] font-semibold px-2.5 py-0.5 rounded-full`}>
                    {other.category}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">{other.dateLabel}</span>
                </div>
                <div className="text-lg font-black text-gray-900 tracking-tight leading-snug group-hover:underline decoration-1 underline-offset-4">
                  {other.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default BlogDetails;

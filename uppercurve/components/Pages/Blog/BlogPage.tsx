import React from "react";
import Link from "next/link";
import { TextAnimation, AnimateWrapper } from "@/components/Animations";
import { blogPosts } from "./blogData";
import BlogPoster from "./BlogPoster";
import BlogExplorer from "./BlogExplorer";

export function BlogPage() {
  const sorted = [...blogPosts].sort((a, b) => b.dateISO.localeCompare(a.dateISO));
  const [mainFeature, ...others] = sorted;
  const sideFeatures = others.slice(0, 2);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center">
      {/* Hero */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#cbd5e1_2px,transparent_2px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_55%_45%_at_50%_35%,#000_25%,transparent_95%)] opacity-35" />
        <section className="relative max-w-7xl mx-auto pt-14 max-sm:pt-10 pb-12 px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-1 py-1 pr-2 mb-8 shadow-sm">
            <span className="bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Blog
            </span>
            <span className="text-sm font-[450] text-indigo-950">Ideas for the way up</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[1.05] max-w-4xl mb-6">
            <TextAnimation>Notes from</TextAnimation> <br className="hidden sm:inline" />
            <TextAnimation>the UpperCurve</TextAnimation>
          </h1>

          <p className="text-gray-500 text-md font-normal max-w-xl leading-relaxed">
            Practical writing on AI, careers, building, and growth — from mentors and
            the UpperCurve community. No hype, no fluff.
          </p>
        </section>
      </div>

      {/* Featured */}
      <section className="w-full max-w-7xl mx-auto px-5 md:px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-6">
          Featured posts
        </h2>

        <AnimateWrapper className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Main featured card */}
          <Link
            href={`/blog/${mainFeature.slug}`}
            className="group flex flex-col bg-white rounded-3xl border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="min-h-[280px] sm:min-h-[340px] flex-1 overflow-hidden">
              <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]">
                <BlogPoster post={mainFeature} featured />
              </div>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-gray-900 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                  Newest
                </span>
                <span className={`${mainFeature.chip} border text-[11px] font-semibold px-3 py-1 rounded-full`}>
                  {mainFeature.category}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight mb-3">
                {mainFeature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">{mainFeature.excerpt}</p>
              <div className="text-xs font-semibold text-gray-500">
                {mainFeature.dateLabel} · {mainFeature.readTime}
              </div>
            </div>
          </Link>

          {/* Side featured cards */}
          <div className="flex flex-col gap-6">
            {sideFeatures.map((post, idx) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex-1 grid grid-cols-1 sm:grid-cols-5 bg-white rounded-3xl border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="sm:col-span-2 min-h-[180px] overflow-hidden">
                  <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
                    <BlogPoster post={post} />
                  </div>
                </div>
                <div className="sm:col-span-3 flex flex-col justify-center p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-gray-100 border border-gray-200/70 text-gray-700 text-[11px] font-semibold px-3 py-1 rounded-full">
                      {idx === 0 ? "Recommended" : "Popular pick"}
                    </span>
                    <span className={`${post.chip} border text-[11px] font-semibold px-3 py-1 rounded-full`}>
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight leading-snug mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="text-xs font-semibold text-gray-500">
                    {post.dateLabel} · {post.readTime}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </AnimateWrapper>
      </section>

      {/* Discover */}
      <section className="w-full max-w-7xl mx-auto px-5 md:px-6 py-12 pb-24">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-8">
          Discover our posts
        </h2>
        <BlogExplorer />
      </section>
    </main>
  );
}

export default BlogPage;

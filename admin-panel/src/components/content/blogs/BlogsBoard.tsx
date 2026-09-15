"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDateLabel, isScheduled, type BlogPost } from "@/lib/content";
import { contentApi } from "../api";
import { ConfirmDelete } from "../ConfirmDelete";
import { BlogCard } from "../site/BlogSite";

type StatusFilter = "All" | "Published" | "Scheduled" | "Drafts";

function statusOf(post: BlogPost): Exclude<StatusFilter, "All"> {
  if (post.status !== "Published") return "Drafts";
  return isScheduled(post) ? "Scheduled" : "Published";
}

const STATUS_CHIP: Record<Exclude<StatusFilter, "All">, { label: string; className: string }> = {
  Published: { label: "Published", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  Scheduled: { label: "Scheduled", className: "bg-blue-50 text-[#0066FF] border-blue-200" },
  Drafts: { label: "Draft", className: "bg-amber-50 text-amber-700 border-amber-200/80" },
};

export function BlogsBoard({ posts, basePath, siteUrl }: { posts: BlogPost[]; basePath: string; siteUrl: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<StatusFilter>("All");
  const [category, setCategory] = useState("All Articles");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "updated">("newest");
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);

  const categories = useMemo(() => {
    const names = Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => !!c))).sort();
    return ["All Articles", ...names];
  }, [posts]);

  const byStatus = useMemo(
    () => (status === "All" ? posts : posts.filter((p) => statusOf(p) === status)),
    [posts, status]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return byStatus
      .filter((p) => category === "All Articles" || p.category === category)
      .filter((p) => !q || `${p.title} ${p.excerpt} ${p.slug} ${p.tags.join(" ")}`.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === "updated"
          ? b.updatedAt.localeCompare(a.updatedAt)
          : sort === "newest"
            ? b.publishDate.localeCompare(a.publishDate)
            : a.publishDate.localeCompare(b.publishDate)
      );
  }, [byStatus, category, query, sort]);

  const countStatus = (s: StatusFilter) => (s === "All" ? posts.length : posts.filter((p) => statusOf(p) === s).length);
  const countCategory = (c: string) =>
    c === "All Articles" ? byStatus.length : byStatus.filter((p) => p.category === c).length;

  async function handleDelete(post: BlogPost) {
    try {
      await contentApi.deleteBlog(post.id);
      toast.success("Post deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete");
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header — the blog page's hero pill + headline, admin-sized. */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-1 py-1 pr-3 shadow-sm">
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">Blog</span>
            <span className="text-sm font-[450] text-indigo-950">Ideas for the way up</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 md:text-5xl">Blog posts</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
            Write, schedule and publish articles on the UpperCurve blog. Published posts appear on{" "}
            <span className="font-semibold text-gray-700">{siteUrl.replace(/^https?:\/\//, "")}/blog</span>.
          </p>
        </div>
        <Link
          href={`${basePath}/new`}
          className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)] transition-all hover:bg-gray-800 active:scale-[0.97]"
        >
          <Plus className="size-4" /> New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50/60 px-6 py-20 text-center">
          <h2 className="text-2xl font-black tracking-tight text-gray-900">No posts yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            Your first article will show up here — and on the blog once you publish it.
          </p>
          <Link href={`${basePath}/new`} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-gray-800">
            <Plus className="size-4" /> Write a post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          <aside className="lg:sticky lg:top-6 lg:col-span-3">
            <div className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Status</div>
            <div className="mb-8 flex flex-wrap gap-2 lg:flex-col">
              {(["All", "Published", "Scheduled", "Drafts"] as StatusFilter[]).map((s) => (
                <FilterPill key={s} active={status === s} label={s === "All" ? "All posts" : s} count={countStatus(s)} onClick={() => setStatus(s)} />
              ))}
            </div>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">Categories</div>
            <div className="flex flex-wrap gap-2 lg:flex-col">
              {categories.map((c) => (
                <FilterPill key={c} active={category === c} label={c} count={countCategory(c)} onClick={() => setCategory(c)} />
              ))}
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold text-gray-500">
                {visible.length} article{visible.length === 1 ? "" : "s"}
              </div>
              <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
                <div className="relative w-full max-w-xs">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search posts"
                    className="w-full rounded-full border border-gray-200/80 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-gray-900 shadow-sm outline-none transition-all placeholder:font-medium placeholder:text-gray-400 hover:border-gray-300 focus:border-[#0066FF] focus:ring-3 focus:ring-blue-100"
                  />
                </div>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                    className="cursor-pointer appearance-none rounded-full border border-gray-200/80 bg-white py-2.5 pl-5 pr-10 text-sm font-semibold text-gray-900 shadow-sm outline-none transition-all hover:border-gray-300 focus:ring-2 focus:ring-black"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="updated">Recently edited</option>
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">▼</span>
                </div>
              </div>
            </div>

            {visible.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 px-6 py-16 text-center text-sm font-medium text-gray-500">
                No posts match these filters.
              </div>
            ) : (
              <div className="uc-site grid grid-cols-1 gap-6 sm:grid-cols-2 2xl:grid-cols-3">
                {visible.map((post) => {
                  const s = statusOf(post);
                  const live = s === "Published";
                  return (
                    <BlogCard
                      key={post.id}
                      post={post}
                      siteUrl={siteUrl}
                      href={`${basePath}/${post.id}`}
                      badge={
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold",
                            STATUS_CHIP[s].className
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {s === "Scheduled" ? `Scheduled · ${formatDateLabel(post.publishDate)}` : STATUS_CHIP[s].label}
                        </span>
                      }
                      footerAction={
                        <span className="relative z-30 inline-flex items-center gap-1">
                          {live && (
                            <a
                              href={`${siteUrl}/blog/${post.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-[#0066FF]"
                              title="View on website"
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setPendingDelete(post)}
                            className="rounded-full p-1.5 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600"
                            title="Delete post"
                          >
                            <Trash2 className="size-4" />
                          </button>
                          <Link
                            href={`${basePath}/${post.id}`}
                            className="ml-1.5 inline-flex items-center gap-1.5 text-sm font-bold text-gray-900"
                          >
                            Edit
                            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                          </Link>
                        </span>
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDelete
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        what="post"
        name={pendingDelete?.title || ""}
        published={pendingDelete?.status === "Published"}
        onConfirm={() => pendingDelete && handleDelete(pendingDelete)}
      />
    </div>
  );
}

function FilterPill({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-3 rounded-full border px-4 py-2.5 text-left text-sm font-semibold transition-all duration-200",
        active
          ? "border-gray-900 bg-gray-900 text-white shadow-md"
          : "border-gray-200/80 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
      )}
    >
      <span>{label}</span>
      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", active ? "bg-white/15 text-white" : "bg-gray-100 text-gray-500")}>
        {count}
      </span>
    </button>
  );
}

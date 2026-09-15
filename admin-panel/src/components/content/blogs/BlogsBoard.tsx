"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, ExternalLink, FileText, MoreHorizontal, PencilLine, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { button, surface } from "@/lib/ui";
import { formatDateLabel, isScheduled, resolveAsset, themeOf, type BlogPost } from "@/lib/content";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState, Page } from "@/components/Page";
import { contentApi } from "../api";
import { ConfirmDelete } from "../ConfirmDelete";
import { FilterTabs, PlainSelect, SearchInput, StatusLabel, ViewToggle, type ViewMode } from "../ListToolbar";
import { BlogCard } from "../site/BlogSite";

type StatusFilter = "all" | "Published" | "Scheduled" | "Draft";

function statusOf(post: BlogPost): Exclude<StatusFilter, "all"> {
  if (post.status !== "Published") return "Draft";
  return isScheduled(post) ? "Scheduled" : "Published";
}

export function BlogsBoard({ posts, basePath, siteUrl }: { posts: BlogPost[]; basePath: string; siteUrl: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<ViewMode>("list");
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => !!c))).sort(),
    [posts]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts
      .filter((p) => status === "all" || statusOf(p) === status)
      .filter((p) => category === "all" || p.category === category)
      .filter((p) => !q || `${p.title} ${p.excerpt} ${p.slug} ${p.tags.join(" ")}`.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === "updated"
          ? b.updatedAt.localeCompare(a.updatedAt)
          : sort === "newest"
            ? b.publishDate.localeCompare(a.publishDate)
            : a.publishDate.localeCompare(b.publishDate)
      );
  }, [posts, status, category, query, sort]);

  const count = (s: StatusFilter) => (s === "all" ? posts.length : posts.filter((p) => statusOf(p) === s).length);

  async function handleDelete(post: BlogPost) {
    try {
      await contentApi.deleteBlog(post.id);
      toast.success("Post deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete");
    }
  }

  function copyLink(post: BlogPost) {
    navigator.clipboard.writeText(`${siteUrl}/blog/${post.slug}`).then(
      () => toast.success("Link copied"),
      () => toast.error("Couldn't copy the link")
    );
  }

  const newPost = (
    <Link href={`${basePath}/new`} className={button.primary}>
      <Plus /> New post
    </Link>
  );

  return (
    <Page title="Blogs" description="Articles published to the UpperCurve blog." actions={posts.length > 0 && newPost}>
      {posts.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="No posts yet"
          description="Your first article will show up here — and on the website once you publish it."
          action={newPost}
        />
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-gray-100">
            <FilterTabs
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "All", count: count("all") },
                { value: "Published", label: "Published", count: count("Published") },
                { value: "Scheduled", label: "Scheduled", count: count("Scheduled") },
                { value: "Draft", label: "Drafts", count: count("Draft") },
              ]}
            />
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <SearchInput value={query} onChange={setQuery} placeholder="Search posts" />
              <PlainSelect
                label="Category"
                value={category}
                onChange={setCategory}
                options={[{ value: "all", label: "All categories" }, ...categories.map((c) => ({ value: c, label: c }))]}
              />
              <PlainSelect
                label="Sort"
                value={sort}
                onChange={setSort}
                options={[
                  { value: "newest", label: "Newest" },
                  { value: "oldest", label: "Oldest" },
                  { value: "updated", label: "Recently edited" },
                ]}
              />
              <ViewToggle value={view} onChange={setView} />
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-500">No posts match these filters.</p>
          ) : view === "gallery" ? (
            <div className="uc-site grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  siteUrl={siteUrl}
                  href={`${basePath}/${post.id}`}
                  badge={<StatusLabel status={statusOf(post)} className="mr-1" />}
                  footerAction={<span className="text-sm font-bold text-gray-900">Edit →</span>}
                />
              ))}
            </div>
          ) : (
            <div className={surface}>
              <div className="hidden grid-cols-[minmax(0,1fr)_120px_120px_40px] items-center gap-4 border-b border-gray-100 px-4 py-2.5 text-xs text-gray-400 md:grid">
                <span>Title</span>
                <span>Status</span>
                <span>Publish date</span>
                <span />
              </div>
              <ul className="divide-y divide-gray-100">
                {visible.map((post) => {
                  const s = statusOf(post);
                  const cover = resolveAsset(post.coverImage, siteUrl);
                  const href = `${basePath}/${post.id}`;
                  return (
                    <li
                      key={post.id}
                      className="group relative grid grid-cols-[minmax(0,1fr)_40px] items-center gap-4 px-4 py-3 transition-colors hover:bg-gray-50/70 md:grid-cols-[minmax(0,1fr)_120px_120px_40px]"
                    >
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div className={cn("relative h-10 w-16 shrink-0 overflow-hidden rounded-md ring-1 ring-black/5", !cover && themeOf(post.theme).gradient)}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {cover && <img src={cover} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <Link href={href} className="block truncate text-[13px] font-medium text-gray-900 after:absolute after:inset-0">
                            {post.title || "Untitled"}
                          </Link>
                          <div className="truncate text-xs text-gray-500">
                            {[post.category, post.readTime, `/blog/${post.slug}`].filter(Boolean).join(" · ")}
                          </div>
                        </div>
                      </div>
                      <StatusLabel status={s} className="hidden md:inline-flex" />
                      <span className="hidden text-xs text-gray-500 tabular-nums md:block">{formatDateLabel(post.publishDate)}</span>
                      <div className="relative z-10 flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button type="button" className={cn(button.icon, "data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900")} aria-label={`Actions for ${post.title}`}>
                              <MoreHorizontal />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5">
                            <DropdownMenuItem asChild className="rounded-lg text-[13px]">
                              <Link href={href}>
                                <PencilLine /> Edit
                              </Link>
                            </DropdownMenuItem>
                            {s === "Published" && (
                              <DropdownMenuItem asChild className="rounded-lg text-[13px]">
                                <a href={`${siteUrl}/blog/${post.slug}`} target="_blank" rel="noreferrer">
                                  <ExternalLink /> View on website
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="rounded-lg text-[13px]" onSelect={() => copyLink(post)}>
                              <Copy /> Copy link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" className="rounded-lg text-[13px]" onSelect={() => setPendingDelete(post)}>
                              <Trash2 /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}

      <ConfirmDelete
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        what="post"
        name={pendingDelete?.title || ""}
        published={pendingDelete?.status === "Published"}
        onConfirm={() => pendingDelete && handleDelete(pendingDelete)}
      />
    </Page>
  );
}

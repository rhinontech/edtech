import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackendError, getBlog, listBlogs, SITE_URL } from "@/lib/backend";
import { todayIso } from "@/lib/content";
import { BlogEditor } from "@/components/content/blogs/BlogEditor";

export const metadata: Metadata = {
  title: "Edit post — Admin Panel",
};

export default async function EditBlogPage({ params }: PageProps<"/[role]/content/blogs/[id]">) {
  const { role, id } = await params;

  const [post, posts] = await Promise.all([
    getBlog(id).catch((err) => {
      if (err instanceof BackendError && err.status === 404) notFound();
      throw err;
    }),
    listBlogs(),
  ]);
  const categories = posts.map((p) => p.category).filter((c): c is string => !!c);

  return (
    <BlogEditor
      key={post.id}
      post={post}
      basePath={`/${role}/content/blogs`}
      siteUrl={SITE_URL}
      today={todayIso()}
      categories={categories}
    />
  );
}

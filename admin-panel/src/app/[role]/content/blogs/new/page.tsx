import type { Metadata } from "next";
import { listBlogs, SITE_URL } from "@/lib/backend";
import { todayIso } from "@/lib/content";
import { BlogEditor } from "@/components/content/blogs/BlogEditor";

export const metadata: Metadata = {
  title: "New post — Admin Panel",
};

export default async function NewBlogPage({ params }: PageProps<"/[role]/content/blogs/new">) {
  const { role } = await params;
  const posts = await listBlogs();
  const categories = posts.map((p) => p.category).filter((c): c is string => !!c);

  return (
    <BlogEditor basePath={`/${role}/content/blogs`} siteUrl={SITE_URL} today={todayIso()} categories={categories} />
  );
}

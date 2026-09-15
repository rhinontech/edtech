import type { Metadata } from "next";
import { listBlogs, SITE_URL } from "@/lib/backend";
import { BlogsBoard } from "@/components/content/blogs/BlogsBoard";

export const metadata: Metadata = {
  title: "Blogs — Admin Panel",
};

export default async function BlogsPage({ params }: PageProps<"/[role]/content/blogs">) {
  const { role } = await params;
  const posts = await listBlogs();
  return <BlogsBoard posts={posts} basePath={`/${role}/content/blogs`} siteUrl={SITE_URL} />;
}

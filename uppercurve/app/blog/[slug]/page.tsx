import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetails from "@/components/Pages/Blog/BlogDetails/BlogDetails";
import { blogPosts, getPostBySlug } from "@/components/Pages/Blog/blogData";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Article not found — UpperCurve" };
  }
  return {
    title: `${post.title} — UpperCurve Blog`,
    description: post.excerpt,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogDetails post={post} />;
}

import type { Metadata } from "next";
import BlogPage from "@/components/Pages/Blog/BlogPage";

export const metadata: Metadata = {
  title: "Blog — UpperCurve",
  description:
    "Practical writing on AI, careers, building, and growth — from mentors and the UpperCurve community.",
};

export default function Page() {
  return <BlogPage />;
}

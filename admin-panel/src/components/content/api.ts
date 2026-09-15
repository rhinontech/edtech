import type { BlogInput, BlogPost, EventInput, EventItem } from "@/lib/content";

// Browser-side calls; they go through app/api/content/[...path] which adds
// the session token and forwards to the backend.
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const isForm = init?.body instanceof FormData;
  const res = await fetch(`/api/content/${path}`, {
    ...init,
    headers: isForm ? init?.headers : { "Content-Type": "application/json", ...init?.headers },
  });

  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Something went wrong");
  }
  return body as T;
}

export const contentApi = {
  async createBlog(input: BlogInput & { slug: string }) {
    const { blog } = await request<{ blog: BlogPost }>("blogs", { method: "POST", body: JSON.stringify(input) });
    return blog;
  },
  async updateBlog(id: string, input: Partial<BlogInput>) {
    const { blog } = await request<{ blog: BlogPost }>(`blogs/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    return blog;
  },
  deleteBlog(id: string) {
    return request<void>(`blogs/${id}`, { method: "DELETE" });
  },

  async createEvent(input: EventInput & { slug: string }) {
    const { event } = await request<{ event: EventItem }>("events", { method: "POST", body: JSON.stringify(input) });
    return event;
  },
  async updateEvent(id: string, input: Partial<EventInput>) {
    const { event } = await request<{ event: EventItem }>(`events/${id}`, { method: "PATCH", body: JSON.stringify(input) });
    return event;
  },
  deleteEvent(id: string) {
    return request<void>(`events/${id}`, { method: "DELETE" });
  },

  async uploadImage(file: File, folder: "blogs" | "events") {
    const form = new FormData();
    form.append("folder", folder);
    form.append("image", file);
    const { url } = await request<{ url: string }>("uploads", { method: "POST", body: form });
    return url;
  },
};

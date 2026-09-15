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

  /**
   * Uploads go straight from the browser to S3 with a short-lived signed POST
   * from the API, so image bytes never pass through the admin panel's host
   * (Vercel rejects request bodies over 4.5 MB). Returns the public URL.
   */
  async uploadImage(file: File, folder: "blogs" | "events") {
    if (!IMAGE_TYPES.includes(file.type)) {
      throw new Error("Only JPEG, PNG, WebP, GIF or AVIF images are allowed");
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      throw new Error(`That image is too large (max ${MAX_IMAGE_MB} MB)`);
    }

    const signed = await request<SignedUpload>("uploads/sign", {
      method: "POST",
      body: JSON.stringify({ contentType: file.type, size: file.size, folder }),
    });

    const form = new FormData();
    for (const [name, value] of Object.entries(signed.upload.fields)) form.append(name, value);
    form.append("file", file); // S3 requires the file to be the last field

    let res: Response;
    try {
      res = await fetch(signed.upload.url, { method: "POST", body: form });
    } catch {
      throw new Error("Couldn't reach storage — check your connection and try again");
    }
    if (!res.ok) {
      const xml = await res.text().catch(() => "");
      const code = /<Code>([^<]+)<\/Code>/.exec(xml)?.[1];
      throw new Error(code === "EntityTooLarge" ? `That image is too large (max ${MAX_IMAGE_MB} MB)` : "Upload failed — please try again");
    }

    return signed.url;
  },
};

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_IMAGE_MB = 8;

interface SignedUpload {
  url: string;
  key: string;
  upload: { url: string; fields: Record<string, string> };
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { button } from "@/lib/ui";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push(next || `/${data.user.role.slug}/dashboard`);
      router.refresh();
    } catch {
      setError("Unable to reach the server");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-600">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-[3px] focus:ring-indigo-500/15"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-gray-600">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-[3px] focus:ring-indigo-500/15"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 px-3 py-2 text-[13px] text-rose-700 ring-1 ring-rose-100">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`${button.primary} mt-2 h-10 w-full`}
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}

export default LoginForm;

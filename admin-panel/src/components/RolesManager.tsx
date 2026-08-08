"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RoleSummary, SidebarCatalogItem } from "@/lib/backend";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Something went wrong");
  }
  return body;
}

function ItemCheckboxes({
  catalog,
  selected,
  onToggle,
}: {
  catalog: SidebarCatalogItem[];
  selected: Set<string>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {catalog.map((item) => (
        <label
          key={item.key}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
            selected.has(item.key)
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
          }`}
        >
          <input
            type="checkbox"
            className="hidden"
            checked={selected.has(item.key)}
            onChange={() => onToggle(item.key)}
          />
          {item.label}
          {!item.isEnabled && <span className="opacity-60">(soon)</span>}
        </label>
      ))}
    </div>
  );
}

function RoleRow({ role, catalog }: { role: RoleSummary; catalog: SidebarCatalogItem[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState(new Set(role.sidebarItemKeys));
  const [name, setName] = useState(role.name);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    name !== role.name ||
    selected.size !== role.sidebarItemKeys.length ||
    [...selected].some((k) => !role.sidebarItemKeys.includes(k));

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await api(`/api/roles/${role.id}`, {
        method: "PATCH",
        body: JSON.stringify({ name, sidebarItemKeys: [...selected] }),
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete the "${role.name}" role?`)) return;
    setSaving(true);
    setError(null);
    try {
      await api(`/api/roles/${role.id}`, { method: "DELETE" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={role.isSystem}
            className="rounded-lg border border-transparent px-2 py-1 text-sm font-bold text-slate-900 outline-none transition focus:border-slate-200 focus:bg-slate-50 disabled:cursor-not-allowed"
          />
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
            {role.slug}
          </span>
          {role.isSystem && (
            <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-600">
              Built-in
            </span>
          )}
        </div>
        <div className="text-xs font-semibold text-slate-400">
          {role.userCount} user{role.userCount === 1 ? "" : "s"}
        </div>
      </div>

      <div className="mt-4">
        <ItemCheckboxes catalog={catalog} selected={selected} onToggle={toggle} />
      </div>

      {error && <p className="mt-3 text-xs font-medium text-rose-600">{error}</p>}

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {!role.isSystem && (
          <button
            onClick={handleDelete}
            disabled={saving}
            className="rounded-xl border border-rose-200 px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete role
          </button>
        )}
      </div>
    </div>
  );
}

function CreateRoleForm({ catalog }: { catalog: SidebarCatalogItem[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(new Set<string>());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await api("/api/roles", {
        method: "POST",
        body: JSON.stringify({ name, sidebarItemKeys: [...selected] }),
      });
      setName("");
      setSelected(new Set());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create role");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleCreate}
      className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5"
    >
      <div className="text-sm font-bold text-slate-900">New role</div>
      <div className="mt-3 flex flex-wrap gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Content Editor"
          className="min-w-[220px] flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
        />
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Creating…" : "Create role"}
        </button>
      </div>

      <div className="mt-4">
        <ItemCheckboxes catalog={catalog} selected={selected} onToggle={toggle} />
      </div>

      {error && <p className="mt-3 text-xs font-medium text-rose-600">{error}</p>}
    </form>
  );
}

export function RolesManager({
  roles,
  catalog,
}: {
  roles: RoleSummary[];
  catalog: SidebarCatalogItem[];
}) {
  return (
    <div className="space-y-4">
      <CreateRoleForm catalog={catalog} />
      {roles.map((role) => (
        <RoleRow key={role.id} role={role} catalog={catalog} />
      ))}
    </div>
  );
}

export default RolesManager;

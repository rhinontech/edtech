"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { RoleSummary, SidebarCatalogItem } from "@/lib/backend";
import { cn } from "@/lib/utils";
import { button, surface } from "@/lib/ui";

async function api(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (res.status === 204) return {};
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || "Something went wrong");
  }
  return body;
}

function toggleKey(set: Set<string>, key: string) {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

function SectionToggles({
  catalog,
  selected,
  onToggle,
  disabled,
}: {
  catalog: SidebarCatalogItem[];
  selected: Set<string>;
  onToggle: (key: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {catalog.map((item) => {
        const on = selected.has(item.key);
        return (
          <button
            key={item.key}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(item.key)}
            aria-pressed={on}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-colors disabled:opacity-50",
              on
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-900"
            )}
          >
            {on && <Check className="size-3" strokeWidth={2.5} />}
            {item.label}
            {!item.isEnabled && <span className={on ? "text-white/60" : "text-gray-400"}>· soon</span>}
          </button>
        );
      })}
    </div>
  );
}

function RoleRow({ role, catalog }: { role: RoleSummary; catalog: SidebarCatalogItem[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState(new Set(role.sidebarItemKeys));
  const [name, setName] = useState(role.name);
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);

  const dirty =
    name !== role.name ||
    selected.size !== role.sidebarItemKeys.length ||
    [...selected].some((k) => !role.sidebarItemKeys.includes(k));

  async function handleSave() {
    setBusy("save");
    try {
      await api(`/api/roles/${role.id}`, {
        method: "PATCH",
        body: JSON.stringify({ name, sidebarItemKeys: [...selected] }),
      });
      toast.success(`${name} updated`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete the "${role.name}" role?`)) return;
    setBusy("delete");
    try {
      await api(`/api/roles/${role.id}`, { method: "DELETE" });
      toast.success(`${role.name} deleted`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
      setBusy(null);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-[220px_minmax(0,1fr)]">
      <div className="min-w-0">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={role.isSystem}
          aria-label="Role name"
          className="-ml-2 w-full rounded-md border border-transparent px-2 py-1 text-sm font-medium text-gray-900 outline-none transition hover:border-gray-200 focus:border-gray-300 focus:ring-[3px] focus:ring-indigo-500/15 disabled:hover:border-transparent"
        />
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
          <span className="font-mono">{role.slug}</span>
          <span>·</span>
          <span>
            {role.userCount} member{role.userCount === 1 ? "" : "s"}
          </span>
          {role.isSystem && (
            <>
              <span>·</span>
              <span>Built-in</span>
            </>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <SectionToggles
          catalog={catalog}
          selected={selected}
          onToggle={(key) => setSelected((prev) => toggleKey(prev, key))}
          disabled={!!busy}
        />
        <div className="flex shrink-0 items-center gap-1">
          {!role.isSystem && (
            <button type="button" onClick={handleDelete} disabled={!!busy} className={button.icon} title="Delete role">
              {busy === "delete" ? <Loader2 className="animate-spin" /> : <Trash2 />}
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || !!busy}
            className={cn(button.primary, "h-8 px-3.5", !dirty && "invisible")}
          >
            {busy === "save" && <Loader2 className="animate-spin" />} Save
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateRoleForm({ catalog }: { catalog: SidebarCatalogItem[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(new Set<string>());
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await api("/api/roles", {
        method: "POST",
        body: JSON.stringify({ name, sidebarItemKeys: [...selected] }),
      });
      toast.success(`${name.trim()} created`);
      setName("");
      setSelected(new Set());
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create role");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleCreate} className={cn(surface, "mb-8 p-5")}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New role name, e.g. Content Editor"
          aria-label="New role name"
          className="h-9 min-w-60 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-[3px] focus:ring-indigo-500/15"
        />
        <button type="submit" disabled={saving || !name.trim()} className={button.primary}>
          {saving ? <Loader2 className="animate-spin" /> : <Plus />} Create role
        </button>
      </div>
      <div className="mb-2 text-xs font-medium text-gray-500">Can access</div>
      <SectionToggles catalog={catalog} selected={selected} onToggle={(key) => setSelected((prev) => toggleKey(prev, key))} />
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
    <>
      <CreateRoleForm catalog={catalog} />
      <div className={surface}>
        <div className="hidden grid-cols-[220px_minmax(0,1fr)] border-b border-gray-100 px-5 py-2.5 text-xs font-medium text-gray-400 md:grid">
          <span>Role</span>
          <span>Sections it can access</span>
        </div>
        <div className="divide-y divide-gray-100">
          {roles.map((role) => (
            <RoleRow key={role.id} role={role} catalog={catalog} />
          ))}
        </div>
      </div>
    </>
  );
}

export default RolesManager;

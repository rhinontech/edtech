import type { Metadata } from "next";
import { listRoles, getSidebarCatalog, BackendError } from "@/lib/backend";
import RolesManager from "@/components/RolesManager";

export const metadata: Metadata = {
  title: "Roles — Admin Panel",
};

export default async function RolesPage() {
  try {
    const [roles, catalog] = await Promise.all([listRoles(), getSidebarCatalog()]);

    return (
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Roles</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create roles and choose which sidebar sections each one can see.
        </p>

        <div className="mt-8">
          <RolesManager roles={roles} catalog={catalog} />
        </div>
      </div>
    );
  } catch (err) {
    if (err instanceof BackendError && err.status === 403) {
      return (
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          You don&apos;t have access to this page.
        </div>
      );
    }
    throw err;
  }
}

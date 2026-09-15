import type { Metadata } from "next";
import { listRoles, getSidebarCatalog, BackendError } from "@/lib/backend";
import RolesManager from "@/components/RolesManager";
import { Page } from "@/components/Page";

export const metadata: Metadata = {
  title: "Roles — Admin Panel",
};

async function loadRoles() {
  try {
    const [roles, catalog] = await Promise.all([listRoles(), getSidebarCatalog()]);
    return { roles, catalog };
  } catch (err) {
    if (err instanceof BackendError && err.status === 403) return null;
    throw err;
  }
}

export default async function RolesPage() {
  const data = await loadRoles();

  if (!data) {
    return (
      <Page title="Roles">
        <p className="text-sm text-gray-500">You don&apos;t have access to this page.</p>
      </Page>
    );
  }

  return (
    <Page title="Roles" description="Create roles and choose which sections of the admin each one can use.">
      <RolesManager roles={data.roles} catalog={data.catalog} />
    </Page>
  );
}

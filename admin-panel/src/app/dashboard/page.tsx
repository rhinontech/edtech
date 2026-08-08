import type { Metadata } from "next";
import { getAdminOverview, getCurrentUser } from "@/lib/backend";

export const metadata: Metadata = {
  title: "Dashboard — Admin Panel",
};

export default async function DashboardPage() {
  const [user, overview] = await Promise.all([getCurrentUser(), getAdminOverview()]);

  const cards = [
    { label: "Total users", value: overview.totalUsers },
    { label: "Superadmins", value: overview.byRole.superadmin ?? 0 },
    { label: "Admins", value: overview.byRole.admin ?? 0 },
  ];

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Here&apos;s what&apos;s happening across the admin panel.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="text-3xl font-extrabold text-slate-900">{card.value}</div>
            <div className="mt-1 text-sm font-medium text-slate-500">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">Account</h2>
        <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-400">Name</dt>
            <dd className="font-semibold text-slate-800">{user.name}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Email</dt>
            <dd className="font-semibold text-slate-800">{user.email}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Role</dt>
            <dd className="font-semibold text-slate-800 capitalize">{user.role}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Last login</dt>
            <dd className="font-semibold text-slate-800">
              {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : "—"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

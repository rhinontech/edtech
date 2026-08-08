const styles: Record<string, string> = {
  superadmin: "bg-violet-50 text-violet-700 border-violet-200",
  admin: "bg-sky-50 text-sky-700 border-sky-200",
};

export function RoleBadge({ role }: { role: string }) {
  const style = styles[role] || "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${style}`}
    >
      {role}
    </span>
  );
}

export default RoleBadge;

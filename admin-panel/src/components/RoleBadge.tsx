const styles: Record<string, string> = {
  superadmin: "bg-[#187CFA]/15 text-[#7db8fd] border-[#187CFA]/30",
  admin: "bg-white/10 text-white/80 border-white/20",
};

export function RoleBadge({ role }: { role: string }) {
  const style = styles[role] || "bg-white/10 text-white/70 border-white/20";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${style}`}
    >
      {role}
    </span>
  );
}

export default RoleBadge;

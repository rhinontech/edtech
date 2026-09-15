export function AccessDenied({ section }: { section: string }) {
  return (
    <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
      You don&apos;t have access to {section}. Ask a super admin to add it to your role.
    </div>
  );
}

export default AccessDenied;

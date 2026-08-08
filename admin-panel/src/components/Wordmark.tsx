export function Wordmark({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <span
      className={`tracking-tight font-extrabold [font-family:var(--font-montserrat)] ${className}`}
    >
      <span className={dark ? "text-white" : "text-[#0B1B42]"}>UPPER</span>
      <span className="text-[#187CFA]">CURVE</span>
    </span>
  );
}

export default Wordmark;

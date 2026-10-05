import Link from "next/link";

export function Logo({
  light = false,
  href = "/",
}: {
  light?: boolean;
  href?: string;
}) {
  const mark = (
    <span className={`relative inline-block pb-[7px] text-[20px] font-bold leading-none tracking-[-0.04em] md:text-[22px] ${light ? "text-white" : "text-ink"}`}>
      amazone
      <svg viewBox="0 0 120 16" className="absolute bottom-0 left-0 h-[9px] w-full" aria-hidden>
        <path d="M6 4c28 12 78 12 108-2" fill="none" stroke="#ff9900" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M100 3.2 114 4.2 106 10" fill="none" stroke="#ff9900" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
  if (!href) return mark;
  return (
    <Link href={href} className="shrink-0" aria-label="amazone home">
      {mark}
    </Link>
  );
}

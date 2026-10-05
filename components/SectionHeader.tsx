import Link from "next/link";

export function SectionHeader({
  title,
  href,
  action = "See more",
}: {
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h2 className="text-[21px] font-bold leading-7">{title}</h2>
      {href && (
        <Link href={href} className="shrink-0 text-[13px] text-link hover:text-link-hover hover:underline">
          {action}
        </Link>
      )}
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-[28px] font-normal">Looking for something?</h1>
      <p className="mt-2 text-muted">We could not find that page.</p>
      <Link href="/" className="mt-4 inline-block text-link hover:underline">Go to the homepage</Link>
    </div>
  );
}

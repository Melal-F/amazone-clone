import { Suspense } from "react";
import { Listing } from "@/components/Listing";

export const metadata = { title: "Search" };

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6 text-muted">Loading results…</p>}>
      <Listing />
    </Suspense>
  );
}

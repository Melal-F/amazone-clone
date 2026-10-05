import { Suspense } from "react";
import { ConfirmationView } from "@/components/AccountViews";

export const metadata = { title: "Order confirmation" };

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6">Loading your order…</p>}>
      <ConfirmationView />
    </Suspense>
  );
}

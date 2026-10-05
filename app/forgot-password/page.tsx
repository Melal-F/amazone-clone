import { Suspense } from "react";
import { ForgotForm } from "@/components/AuthForms";

export const metadata = { title: "Password assistance" };

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6">Loading…</p>}>
      <ForgotForm />
    </Suspense>
  );
}

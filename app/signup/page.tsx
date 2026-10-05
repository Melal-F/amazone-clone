import { Suspense } from "react";
import { SignUpForm } from "@/components/AuthForms";

export const metadata = { title: "Create account" };

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6">Loading…</p>}>
      <SignUpForm />
    </Suspense>
  );
}

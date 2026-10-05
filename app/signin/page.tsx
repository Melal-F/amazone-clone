import { Suspense } from "react";
import { SignInForm } from "@/components/AuthForms";

export const metadata = { title: "Sign in" };

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6">Loading…</p>}>
      <SignInForm />
    </Suspense>
  );
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { AuthFrame, safeNext } from "./AuthFrame";
import { Button } from "./Button";
import { Input } from "./Input";

const wait = () => new Promise((resolve) => setTimeout(resolve, 450));
const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const phoneOk = (value: string) => value.replace(/\D/g, "").length >= 10;

export function SignInForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { signin } = useStore();
  const [step, setStep] = useState<"id" | "password">("id");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthFrame>
      <div className="rounded-[4px] border border-line p-5">
        <h1 className="mb-4 text-[28px] font-normal leading-9">Sign in</h1>
        {step === "id" ? (
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!emailOk(id.trim()) && !phoneOk(id)) {
                setError("Enter a valid email or mobile number.");
                return;
              }
              setError("");
              setLoading(true);
              await wait();
              setLoading(false);
              setStep("password");
            }}
          >
            <Input label="Email or mobile phone number" value={id} onChange={(event) => setId(event.target.value)} autoComplete="username" error={error} />
            <Button type="submit" block disabled={loading}>{loading ? "Please wait" : "Continue"}</Button>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              if (password.length < 6) {
                setError("Passwords must be at least 6 characters.");
                return;
              }
              setLoading(true);
              await wait();
              const message = signin(id, password);
              setLoading(false);
              if (message) {
                setError(message);
                return;
              }
              router.push(next);
            }}
          >
            <p className="text-[13px] font-normal">{id} <button type="button" className="text-link hover:underline" onClick={() => { setStep("id"); setError(""); }}>Change</button></p>
            <div className="flex items-end justify-between">
              <span className="text-[13px] font-bold">Password</span>
              <Link href="/forgot-password" className="text-[13px] font-normal text-link hover:text-link-hover hover:underline">Forgot password?</Link>
            </div>
            <Input label="Password" reveal value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" error={error} />
            <Button type="submit" block disabled={loading}>{loading ? "Please wait" : "Sign in"}</Button>
          </form>
        )}
      </div>
      <div className="my-4 flex items-center gap-2 text-[12px] text-muted">
        <span className="h-px flex-1 bg-line" />
        New to amazone?
        <span className="h-px flex-1 bg-line" />
      </div>
      <Link href={`/signup?next=${encodeURIComponent(next)}`} className="flex h-8 items-center justify-center rounded-[7px] border border-line-strong bg-white text-[13px] shadow-[0_2px_5px_rgba(213,217,217,.5)]">
        Create your amazone account
      </Link>
    </AuthFrame>
  );
}

export function SignUpForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const { signup } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  return (
    <AuthFrame>
      <div className="rounded-[4px] border border-line p-5">
        <h1 className="mb-4 text-[28px] font-normal leading-9">Create account</h1>
        <form
          className="space-y-3"
          onSubmit={async (event) => {
            event.preventDefault();
            const nextErrors: Record<string, string> = {};
            if (name.trim().length < 2) nextErrors.name = "Enter your name.";
            if (!emailOk(email)) nextErrors.email = "Enter a valid email address.";
            if (phone && !phoneOk(phone)) nextErrors.phone = "Enter a 10-digit mobile number.";
            if (password.length < 6) nextErrors.password = "Passwords must be at least 6 characters.";
            if (password !== confirm) nextErrors.confirm = "Passwords must match.";
            if (!terms) nextErrors.terms = "Accept the conditions to continue.";
            setErrors(nextErrors);
            if (Object.keys(nextErrors).length) return;
            setLoading(true);
            await wait();
            const message = signup({ name, email, phone, password });
            setLoading(false);
            if (message) {
              setErrors({ email: message });
              return;
            }
            router.push(next);
          }}
        >
          <Input label="Your name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" error={errors.name} />
          <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" error={errors.email} />
          <Input label="Mobile number (optional)" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" error={errors.phone} />
          <Input label="Password" reveal value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" error={errors.password} />
          <Input label="Re-enter password" reveal value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" error={errors.confirm} />
          <label className="flex items-start gap-2 text-[13px] font-normal">
            <input type="checkbox" className="mt-0.5" checked={terms} onChange={(event) => setTerms(event.target.checked)} />
            <span>I agree to the Conditions of Use and Privacy Notice. This account stays in this browser.</span>
          </label>
          {errors.terms && <p className="text-[12px] text-price">{errors.terms}</p>}
          <Button type="submit" block disabled={loading}>{loading ? "Please wait" : "Create your amazone account"}</Button>
        </form>
      </div>
      <p className="mt-4 text-[13px]">
        Already have an account? <Link href={`/signin?next=${encodeURIComponent(next)}`} className="text-link hover:text-link-hover hover:underline">Sign in</Link>
      </p>
    </AuthFrame>
  );
}

export function ForgotForm() {
  const { resetPassword } = useStore();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <AuthFrame>
      <div className="rounded-[4px] border border-line p-5">
        <h1 className="mb-3 text-[28px] font-normal leading-9">Password assistance</h1>
        {done ? (
          <p className="text-[14px] font-normal">Password updated. <Link href="/signin" className="text-link hover:underline">Sign in</Link></p>
        ) : !sent ? (
          <form
            className="space-y-3"
            onSubmit={async (event) => {
              event.preventDefault();
              if (!emailOk(email)) {
                setError("Enter a valid email address.");
                return;
              }
              setError("");
              setLoading(true);
              await wait();
              setLoading(false);
              setSent(true);
            }}
          >
            <p className="text-[13px] font-normal">Enter the email address on the account.</p>
            <Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} error={error} />
            <Button type="submit" block disabled={loading}>{loading ? "Please wait" : "Continue"}</Button>
          </form>
        ) : (
          <form
            className="space-y-3"
            onSubmit={async (event) => {
              event.preventDefault();
              if (password.length < 6) {
                setError("Passwords must be at least 6 characters.");
                return;
              }
              setLoading(true);
              await wait();
              const message = resetPassword(email, code, password);
              setLoading(false);
              if (message) {
                setError(message);
                return;
              }
              setDone(true);
            }}
          >
            <p className="text-[13px] font-normal">No email is sent in this demo. Use code <span className="font-bold">482913</span>.</p>
            <Input label="Code" value={code} onChange={(event) => setCode(event.target.value)} error={error} />
            <Input label="New password" reveal value={password} onChange={(event) => setPassword(event.target.value)} />
            <Button type="submit" block disabled={loading}>{loading ? "Please wait" : "Save password"}</Button>
          </form>
        )}
      </div>
    </AuthFrame>
  );
}

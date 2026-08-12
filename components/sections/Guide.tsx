"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Check, CheckCircle2 } from "lucide-react";
import { requestGuide, type GuideState } from "@/app/actions/guide";
import { Reveal } from "@/components/ui/Reveal";
import type { GuideSection } from "@/content/types";

const initialState: GuideState = { status: "idle" };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-on-accent w-full px-6 py-4 text-base disabled:opacity-70 sm:w-auto"
    >
      {pending ? "שולח…" : label}
    </button>
  );
}

export function Guide({ data }: { data: GuideSection }) {
  const [state, formAction] = useActionState(requestGuide, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === "idle") return;
    statusRef.current?.focus();
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  const field = (error?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted ${
      error ? "border-[#6e1018]" : "border-ink"
    }`;

  return (
    <section id="guide" aria-labelledby="guide-title" className="bg-cream-50 py-20 md:py-28">
      <div className="shell">
        <Reveal className="on-accent overflow-hidden rounded-3xl bg-accent p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              {/* The whole message column reads in white here, the label with it. */}
              <p className="eyebrow !text-white [&::before]:!bg-white">{data.eyebrow}</p>
              <h2 id="guide-title" className="mt-3 text-3xl text-white md:text-4xl">
                {data.title}
              </h2>
              <p className="mt-5 text-lg text-white">{data.lead}</p>

              <ul className="mt-6 space-y-3">
                {data.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <Check className="mt-1 size-5 shrink-0 text-white" aria-hidden="true" />
                    <span className="text-white">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form ref={formRef} action={formAction} noValidate className="space-y-5 self-center">
              {/* Honeypot */}
              <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
                <label htmlFor="guide-website">אל תמלאו שדה זה</label>
                <input id="guide-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div>
                <label htmlFor="guide-name" className="block text-sm font-medium text-white">
                  שם פרטי
                  <span aria-hidden="true" className="text-white">
                    {" "}
                    *
                  </span>
                  <span className="sr-only"> (שדה חובה)</span>
                </label>
                <input
                  id="guide-name"
                  name="name"
                  type="text"
                  autoComplete="given-name"
                  required
                  defaultValue={state.values?.name}
                  {...(state.fieldErrors?.name
                    ? { "aria-invalid": true as const, "aria-describedby": "guide-name-error" }
                    : {})}
                  className={`mt-2 ${field(state.fieldErrors?.name)}`}
                />
                {state.fieldErrors?.name && (
                  <p id="guide-name-error" className="mt-2 text-sm font-medium text-[#6e1018]">
                    {state.fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="guide-email" className="block text-sm font-medium text-white">
                  אימייל
                  <span aria-hidden="true" className="text-white">
                    {" "}
                    *
                  </span>
                  <span className="sr-only"> (שדה חובה)</span>
                </label>
                <input
                  id="guide-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  required
                  defaultValue={state.values?.email}
                  {...(state.fieldErrors?.email
                    ? { "aria-invalid": true as const, "aria-describedby": "guide-email-error" }
                    : {})}
                  className={`mt-2 ${field(state.fieldErrors?.email)}`}
                />
                {state.fieldErrors?.email && (
                  <p id="guide-email-error" className="mt-2 text-sm font-medium text-[#6e1018]">
                    {state.fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <input
                    id="guide-consent"
                    name="consent"
                    type="checkbox"
                    value="on"
                    required
                    {...(state.fieldErrors?.consent
                      ? { "aria-invalid": true as const, "aria-describedby": "guide-consent-error" }
                      : {})}
                    className="mt-1 size-5 shrink-0 accent-[#465b6d]"
                  />
                  <label htmlFor="guide-consent" className="text-sm leading-relaxed text-white">
                    {data.consentLabel}{" "}
                    <Link href="/privacy" className="text-white underline underline-offset-4">
                      (מדיניות הפרטיות)
                    </Link>
                  </label>
                </div>
                {state.fieldErrors?.consent && (
                  <p id="guide-consent-error" className="mt-2 text-sm font-medium text-[#6e1018]">
                    {state.fieldErrors.consent}
                  </p>
                )}
              </div>

              {/* The address is used once and never stored - worth saying plainly. */}
              <p className="text-xs leading-relaxed text-white">
                הכתובת משמשת לשליחת המדריך בלבד, אינה נשמרת אצלי ולא יישלח אליכם דיוור נוסף.
              </p>

              <SubmitButton label={data.submitLabel} />

              <p
                ref={statusRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className={`text-sm ${
                  state.status === "success"
                    ? "flex items-center gap-2 font-medium text-[#0b3d1e]"
                    : state.status === "error"
                      ? "font-medium text-[#6e1018]"
                      : "sr-only"
                }`}
              >
                {state.status === "success" && (
                  <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
                )}
                {state.message}
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

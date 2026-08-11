"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Clock, Mail, Phone } from "lucide-react";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Reveal } from "@/components/ui/Reveal";
import type { ContactSection } from "@/content/types";
import { site } from "@/lib/site";

const initialState: ContactState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="tap mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate px-6 py-4 text-base font-medium text-white transition-colors hover:bg-slate-deep disabled:opacity-70"
    >
      {pending ? "שולח…" : "שליחה"}
    </button>
  );
}

function Field({
  id,
  label,
  error,
  required,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: (props: {
    id: string;
    name: string;
    required?: boolean;
    "aria-invalid"?: true;
    "aria-describedby"?: string;
    className: string;
  }) => React.ReactNode;
}) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="text-slate">
              {" "}
              *
            </span>
            <span className="sr-only"> (שדה חובה)</span>
          </>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">
        {children({
          id,
          name: id,
          required,
          ...(error ? { "aria-invalid": true as const } : {}),
          ...(describedBy ? { "aria-describedby": describedBy } : {}),
          className: `w-full rounded-xl border bg-white px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/70 ${
            error ? "border-[#a4232b]" : "border-field-border focus:border-accent"
          }`,
        })}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-[#a4232b]">
          {error}
        </p>
      )}
    </div>
  );
}

export function Contact({ data }: { data: ContactSection }) {
  const [state, formAction] = useActionState(submitContact, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  // Stamped on the client so the server can reject sub-human fill times.
  useEffect(() => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (state.status === "idle") return;
    // Move the user (and the screen reader) to the outcome message.
    statusRef.current?.focus();
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  const details = [
    { icon: Phone, label: "טלפון", value: site.phoneDisplay, href: `tel:${site.phoneE164}` },
    { icon: Mail, label: "אימייל", value: site.email, href: `mailto:${site.email}` },
    { icon: Clock, label: "שעות פעילות", value: site.hours, href: null },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-cream-50 py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">{data.eyebrow}</p>
          <h2 id="contact-title" className="mt-3 text-3xl text-slate md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-5 text-lg text-muted">{data.lead}</p>

          <ul className="mt-10 space-y-6">
            {details.map((detail) => (
              <li key={detail.label} className="flex items-start gap-4">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-wash text-accent">
                  <detail.icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-muted">{detail.label}</span>
                  {detail.href ? (
                    <a
                      href={detail.href}
                      className="text-lg text-ink underline-offset-4 hover:underline"
                      dir="ltr"
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <span className="text-lg text-ink">{detail.value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={140} className="rounded-3xl border border-cream-200 bg-cream-100 p-6 md:p-9">
          <h3 className="text-xl text-slate">השאירו פרטים ואחזור אליכם</h3>

          <form ref={formRef} action={formAction} noValidate className="mt-6 space-y-5">
            <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="0" />
            {/* Honeypot — hidden from users and from assistive technology. */}
            <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
              <label htmlFor="website">אל תמלאו שדה זה</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <Field id="name" label="שם מלא" required error={state.fieldErrors?.name}>
              {(props) => (
                <input {...props} type="text" autoComplete="name" defaultValue={state.values?.name} />
              )}
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="phone" label="טלפון" required error={state.fieldErrors?.phone}>
                {(props) => (
                  <input
                    {...props}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    defaultValue={state.values?.phone}
                  />
                )}
              </Field>
              <Field id="email" label="אימייל" required error={state.fieldErrors?.email}>
                {(props) => (
                  <input
                    {...props}
                    type="email"
                    autoComplete="email"
                    dir="ltr"
                    defaultValue={state.values?.email}
                  />
                )}
              </Field>
            </div>

            <Field
              id="message"
              label="במה אפשר לעזור?"
              hint="אין צורך לפרט מידע רפואי או אבחנות בשלב הזה."
              error={state.fieldErrors?.message}
            >
              {(props) => <textarea {...props} rows={5} defaultValue={state.values?.message} />}
            </Field>

            <div>
              <div className="flex items-start gap-3">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  value="on"
                  required
                  defaultChecked={state.values?.consent}
                  {...(state.fieldErrors?.consent
                    ? { "aria-invalid": true as const, "aria-describedby": "consent-error" }
                    : {})}
                  className="mt-1 size-5 shrink-0 accent-[#a24c3b]"
                />
                <label htmlFor="consent" className="text-sm leading-relaxed text-ink">
                  {data.consentLabel}{" "}
                  <Link href="/privacy" className="underline underline-offset-4">
                    (מדיניות הפרטיות)
                  </Link>
                </label>
              </div>
              {state.fieldErrors?.consent && (
                <p id="consent-error" className="mt-2 text-sm text-[#a4232b]">
                  {state.fieldErrors.consent}
                </p>
              )}
            </div>

            <SubmitButton />

            <p
              ref={statusRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className={`text-sm ${
                state.status === "success"
                  ? "flex items-center gap-2 text-[#1f6b3e]"
                  : state.status === "error"
                    ? "text-[#a4232b]"
                    : "sr-only"
              }`}
            >
              {state.status === "success" && (
                <CheckCircle2 className="size-5 shrink-0" aria-hidden="true" />
              )}
              {state.message}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

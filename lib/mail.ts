import type { Resend } from "resend";

/**
 * Who the site's mail comes from, and what to do while that is not yet true.
 *
 * The sender is efrat@tzory.com, stated here rather than read from a Vercel
 * variable: the variable was left on Resend's test sender, and finding that
 * out took a reader being refused her guide. Once tzory.com is verified at
 * Resend this simply works, with nothing to change anywhere else.
 *
 * Until then Resend refuses that sender outright. Its test sender,
 * onboarding@resend.dev, still delivers to the account's own address - which
 * is Efrat's - so a refused send is retried from it. That keeps every message
 * addressed to her (the contact form, the notices) arriving, and lets a
 * message to anyone else fail honestly so the caller can fall back.
 */
export const SITE_SENDER = "אפרת צרי <efrat@tzory.com>";
const TEST_SENDER = "onboarding@resend.dev";

type Payload = Omit<Parameters<Resend["emails"]["send"]>[0], "from">;

export async function sendMail(resend: Resend, payload: Payload) {
  const override = process.env.CONTACT_FROM_EMAIL;
  // An override that is not the test sender is a deliberate choice; honour it.
  const primary = override && !override.includes("resend.dev") ? override : SITE_SENDER;

  const first = await resend.emails.send({ ...payload, from: primary } as never);
  if (!first.error) return first;

  const second = await resend.emails.send({ ...payload, from: TEST_SENDER } as never);
  if (!second.error) return second;

  // Report the first refusal: it is the one that says what needs fixing.
  return first;
}

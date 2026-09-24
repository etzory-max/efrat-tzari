"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { getGuideEmail, getSiteSettings } from "@/lib/content";
import { renderEmail } from "@/lib/email";
import { drawings } from "@/components/art/drawings";
import { siteUrl } from "@/lib/site";

export type GuideState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "consent", string>>;
  values?: { name?: string; email?: string };
};

const schema = z.object({
  name: z.string().trim().min(2, "נא למלא שם פרטי").max(60, "השם ארוך מדי"),
  email: z.string().trim().email("נא למלא כתובת אימייל תקינה").max(120),
  consent: z.literal("on", { message: "יש לאשר את שליחת המדריך למייל" }),
});

/** Same best-effort throttle as the contact form. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

export async function requestGuide(
  _previous: GuideState,
  formData: FormData,
): Promise<GuideState> {
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", message: "המדריך נשלח אליכם למייל." };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  const parsed = schema.safeParse({ ...raw, consent: formData.get("consent") ?? "" });
  if (!parsed.success) {
    const fieldErrors: GuideState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof NonNullable<GuideState["fieldErrors"]>;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { status: "error", message: "נא לבדוק את השדות המסומנים.", fieldErrors, values: raw };
  }

  const headerList = await headers();
  const ip = (headerList.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "נשלחו כמה בקשות מהמכשיר הזה. נא לנסות שוב מאוחר יותר.",
      values: raw,
    };
  }

  const settings = await getSiteSettings();
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    console.error("[guide] RESEND_API_KEY / CONTACT_FROM_EMAIL are not configured");
    return {
      status: "error",
      message: `שליחת המדריך אינה זמינה כרגע. אפשר לכתוב ל-${settings.email} ואשלח אותו ידנית.`,
      values: raw,
    };
  }

  try {
    const pdf = await readFile(path.join(process.cwd(), "public", "files", "guide.pdf"));
    const resend = new Resend(apiKey);
    const copy = await getGuideEmail();
    const { html, text } = renderEmail({
      preheader: copy.preheader,
      eyebrow: copy.eyebrow,
      heading: copy.heading.replace("{שם}", parsed.data.name),
      blocks: [
        { kind: "lead", text: copy.lead },
        { kind: "p", text: copy.body },
        { kind: "list", items: copy.bullets },
        {
          kind: "art",
          src: `${siteUrl}${drawings["art-family-hold"].src}`,
          width: 260,
          alt: "",
        },
        { kind: "p", text: copy.closing },
        { kind: "button", label: copy.ctaLabel, href: `${siteUrl}/#contact` },
      ],
      note: copy.note,
      settings,
    });

    const { error } = await resend.emails.send({
      from,
      to: parsed.data.email,
      replyTo: settings.email,
      subject: copy.subject,
      html,
      text,
      attachments: [
        { filename: "מדריך-נמרה-אפרת-צרי.pdf", content: pdf.toString("base64") },
      ],
    });
    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[guide] send failed", error);
    return {
      status: "error",
      message: `השליחה נכשלה. אפשר לנסות שוב או לכתוב ל-${settings.email}.`,
      values: raw,
    };
  }

  // Nothing is stored: no list, no database. The address was used once.
  return { status: "success", message: "המדריך בדרך אליכם למייל. בדקו גם בתיקיית הספאם." };
}

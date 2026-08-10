"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { defaultContent } from "@/content/defaults";
import { site } from "@/lib/site";

type Field = "name" | "phone" | "email" | "subject" | "message" | "consent";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<Field, string>>;
  /**
   * React resets an uncontrolled form once the action resolves, so a failed
   * submission would wipe everything the user typed. Echoing the values back
   * lets the inputs re-mount with them intact.
   */
  values?: Partial<Record<Exclude<Field, "consent">, string>> & { consent?: boolean };
};

const digits = (value: string) => value.replace(/\D/g, "");

const schema = z.object({
  name: z.string().trim().min(2, "נא למלא שם מלא").max(80, "השם ארוך מדי"),
  phone: z
    .string()
    .trim()
    .refine((value) => digits(value).length >= 9 && digits(value).length <= 15, {
      message: "נא למלא מספר טלפון תקין",
    }),
  email: z.string().trim().email("נא למלא כתובת אימייל תקינה").max(120),
  subject: z.enum(defaultContent.contact.subjects as unknown as [string, ...string[]]).catch("אחר"),
  message: z.string().trim().max(2000, "ההודעה ארוכה מדי").optional().default(""),
  consent: z.literal("on", { message: "יש לאשר את מדיניות הפרטיות כדי לשלוח" }),
});

/** Best-effort per-instance throttle: 3 submissions per IP per 10 minutes. */
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

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? "אחר"),
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") === "on",
  };

  // A filled hidden field means a bot. Answer with a plain success so it does
  // not learn what tripped it.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", message: "תודה! הפנייה נשלחה." };
  }

  const parsed = schema.safeParse({ ...raw, consent: formData.get("consent") ?? "" });

  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as Field;
      if (field && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return {
      status: "error",
      message: "לא הצלחנו לשלוח — נא לבדוק את השדות המסומנים.",
      fieldErrors,
      values: raw,
    };
  }

  // Only now check fill time: a real person who fails validation must always
  // get the real field errors, never this generic message.
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (startedAt && Date.now() - startedAt < 1500) {
    return {
      status: "error",
      message: "משהו השתבש בשליחה. נא לנסות שוב.",
      values: raw,
    };
  }

  const headerList = await headers();
  const ip = (headerList.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "נשלחו כמה פניות מהמכשיר הזה. נא לנסות שוב מאוחר יותר או להתקשר ישירות.",
      values: raw,
    };
  }

  const { name, phone, email, subject, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error("[contact] RESEND_API_KEY / CONTACT_FROM_EMAIL are not configured");
    return {
      status: "error",
      message: `שליחת הטופס אינה זמינה כרגע. אפשר להתקשר ל-${site.phoneDisplay} או לכתוב ל-${site.email}.`,
      values: raw,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `פנייה חדשה מהאתר — ${subject} — ${name}`,
      text: [
        `שם: ${name}`,
        `טלפון: ${phone}`,
        `אימייל: ${email}`,
        `נושא: ${subject}`,
        "",
        "הודעה:",
        message || "(לא נכתבה הודעה)",
        "",
        "—",
        "נשלח מטופס יצירת הקשר באתר. הפונה אישר/ה את מדיניות הפרטיות.",
      ].join("\n"),
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[contact] send failed", error);
    return {
      status: "error",
      message: `השליחה נכשלה. אפשר לנסות שוב, להתקשר ל-${site.phoneDisplay} או לכתוב ל-${site.email}.`,
      values: raw,
    };
  }

  return {
    status: "success",
    message: "תודה! הפנייה התקבלה ואחזור אליכם תוך 24 שעות.",
  };
}

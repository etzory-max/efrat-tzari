"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { getGuideEmail, getSiteSettings } from "@/lib/content";
import { renderEmail } from "@/lib/email";
import { sendMail } from "@/lib/mail";
import { drawings } from "@/components/art/drawings";
import { siteUrl } from "@/lib/site";

export type GuideState = {
  status: "idle" | "success" | "error";
  message?: string;
  /**
   * Set when the email could not go out. The reader still gets the guide -
   * she asked for it and it is a public file - so a failure at the mail
   * provider costs Efrat the address, not the reader the guide.
   */
  downloadHref?: string;
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
  /* Ticked, or it did not happen: an unticked box sends nothing at all, which
     is exactly the shape consent should have. */
  const subscribed = formData.get("newsletter") === "on";

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
  if (!apiKey) {
    console.error("[guide] RESEND_API_KEY is not configured");
    return {
      status: "error",
      message: "שליחת המדריך במייל אינה זמינה כרגע — אבל אפשר להוריד אותו כאן, עכשיו.",
      downloadHref: "/files/guide.pdf",
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
      /* A reader who asked to hear more cannot be told her address was not
         kept, so the closing line changes with the box she ticked. */
      note: subscribed ? copy.noteSubscribed : copy.note,
      settings,
    });

    const { error } = await sendMail(resend, {
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

    /* There is no mailing-list service behind this yet, so the opt-in becomes
       a note to Efrat with the two details she needs to act on it. Sent after
       the guide and in its own try: a failure here must not tell a reader her
       guide did not arrive, because it did. */
    if (subscribed) {
      try {
        const notice = renderEmail({
          preheader: `${parsed.data.name} · ${parsed.data.email}`,
          eyebrow: "הרשמה לדיוור",
          heading: parsed.data.name,
          blocks: [
            { kind: "p", text: "סימנה בטופס המדריך שהיא רוצה לקבל ממך עדכונים." },
            {
              kind: "fields",
              rows: [["אימייל", parsed.data.email, `mailto:${parsed.data.email}`]],
            },
          ],
          note: "ההסכמה ניתנה באתר, בתיבה נפרדת מזו של המדריך ובלי סימון מראש. יש לשמור את הרישום הזה כל עוד הכתובת ברשימה.",
          settings,
        });
        await sendMail(resend, {
          to: process.env.CONTACT_TO_EMAIL ?? settings.email,
          replyTo: parsed.data.email,
          subject: `הרשמה לדיוור — ${parsed.data.name}`,
          html: notice.html,
          text: notice.text,
        });
      } catch (noticeError) {
        console.error("[guide] subscriber notice failed", noticeError);
      }
    }
  } catch (error) {
    console.error("[guide] send failed", error);

    /* Tell Efrat who asked, so she can send it by hand. This can succeed
       where the reader's copy failed: a sender not yet verified at Resend may
       still write to the account's own address, which is hers. Its own try,
       because nothing about it may change what the reader is told. */
    if (apiKey) {
      try {
        const notice = renderEmail({
          preheader: `${parsed.data.name} · ${parsed.data.email}`,
          eyebrow: "המדריך לא נשלח",
          heading: parsed.data.name,
          blocks: [
            {
              kind: "p",
              text: "ביקשה את המדריך באתר, והמייל אליה לא יצא. היא קיבלה קישור להורדה ישירה בעמוד, אבל כדאי לשלוח לה אותו גם במייל.",
            },
            { kind: "fields", rows: [["אימייל", parsed.data.email, `mailto:${parsed.data.email}`]] },
          ],
          note: subscribed
            ? "היא סימנה גם הרשמה לדיוור."
            : "היא לא סימנה הרשמה לדיוור — לשלוח את המדריך בלבד.",
          settings,
        });
        await sendMail(new Resend(apiKey), {
          to: process.env.CONTACT_TO_EMAIL ?? settings.email,
          replyTo: parsed.data.email,
          subject: `המדריך לא נשלח — ${parsed.data.name}`,
          html: notice.html,
          text: notice.text,
        });
      } catch (noticeError) {
        console.error("[guide] failure notice also failed", noticeError);
      }
    }

    return {
      status: "error",
      message: "לא הצלחנו לשלוח את המדריך למייל — אבל אפשר להוריד אותו כאן, עכשיו.",
      downloadHref: "/files/guide.pdf",
      values: raw,
    };
  }

  // Nothing is stored: no list, no database. The address was used once.
  return { status: "success", message: "המדריך בדרך אליכם למייל. בדקו גם בתיקיית הספאם." };
}

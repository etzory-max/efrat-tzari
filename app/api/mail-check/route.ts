import { NextResponse } from "next/server";
import { SITE_SENDER } from "@/lib/mail";

/**
 * What Resend thinks of this site, without opening Vercel.
 *
 *   GET /api/mail-check?secret=<SANITY_REVALIDATE_SECRET>
 *
 * The guide and the contact form both fail with one generic sentence, and the
 * reason Resend gave stays in a server log only the Vercel account can read.
 * This answers the two questions that decide whether mail can reach a
 * stranger: which address the site sends from, and whether that address's
 * domain is verified. It never returns the key, and it sends nothing.
 *
 * Behind the same secret as the revalidation hook, so it is not a public
 * window onto the mail setup.
 */
export async function GET(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret || new URL(request.url).searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const key = process.env.RESEND_API_KEY;
  // The sender the site actually tries first - see lib/mail.ts.
  const override = process.env.CONTACT_FROM_EMAIL;
  const from = override && !override.includes("resend.dev") ? override : SITE_SENDER;
  const fromDomain = from?.match(/@([^>\s]+)>?$/)?.[1]?.toLowerCase() ?? null;

  if (!key) return NextResponse.json({ keyPresent: false, from });

  const res = await fetch("https://api.resend.com/domains", {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  const body = (await res.json().catch(() => null)) as {
    data?: { name: string; status: string }[];
    message?: string;
  } | null;

  const domains = (body?.data ?? []).map((d) => ({ name: d.name, status: d.status }));
  const senderDomain = domains.find((d) => d.name.toLowerCase() === fromDomain) ?? null;

  return NextResponse.json({
    keyPresent: true,
    keyAccepted: res.ok,
    resendMessage: res.ok ? undefined : body?.message,
    from,
    fromDomain,
    domains,
    senderDomainVerified: senderDomain?.status === "verified",
  });
}

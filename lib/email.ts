import type { SiteSettings } from "@/lib/content";
import { siteUrl } from "@/lib/site";

/**
 * The site, in an inbox.
 *
 * Email is not the web: no stylesheet, no flexbox, no grid, and Outlook still
 * renders with Word. So everything here is nested tables with inline styles,
 * which is the only layout every client agrees on. Backgrounds are set on the
 * cells themselves rather than inherited, because a client in dark mode will
 * invert what it can and leave what it cannot.
 *
 * Images are absolute URLs on the live site. A logo drawn as SVG - the way the
 * page does it - is stripped by Gmail, so the mark here is drawn with a table
 * cell and a border radius, and the one real image is a PNG.
 *
 * Every message goes out as HTML *and* as plain text. Clients that refuse HTML
 * get the text part, and a message with no text part scores worse with spam
 * filters, which matters for something sent from a new domain.
 */

const SLATE = "#465b6d";
const CREAM = "#f5f2ed";
const ACCENT = "#d69a7e";
const ACCENT_INK = "#9c4c2e";
const INK = "#2c333a";
const MUTED = "#55606b";
const LINE = "#e2ddd3";

const FONT = "'Rubik', 'Segoe UI', Arial, sans-serif";

export type EmailBlock =
  | { kind: "fields"; rows: [label: string, value: string, href?: string][] }
  | { kind: "quote"; text: string }
  | { kind: "actions"; items: { label: string; href: string }[] }
  | { kind: "p"; text: string }
  | { kind: "lead"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "button"; label: string; href: string }
  | { kind: "art"; src: string; width: number; alt?: string };

/** Everything a message needs, without any HTML in the calling code. */
export function renderEmail({
  preheader,
  eyebrow,
  heading,
  blocks,
  note,
  settings,
}: {
  /** The line shown beside the subject in the inbox list. */
  preheader: string;
  eyebrow: string;
  heading: string;
  blocks: EmailBlock[];
  /** The small print under the rule - why this arrived, and what is not kept. */
  note: string;
  /**
   * The name, phone and address in the footer, read from the Studio like the
   * page reads them. They used to be the constants in lib/site.ts, so editing
   * the phone number in Sanity changed the site and left every outgoing
   * message quoting the old one.
   */
  settings: SiteSettings;
}) {
  const body = blocks
    .map((block) => {
      switch (block.kind) {
        case "lead":
          return `<p style="margin:0 0 18px;font-size:18px;line-height:1.7;color:${INK}">${block.text}</p>`;
        case "p":
          return `<p style="margin:0 0 16px;font-size:16px;line-height:1.75;color:${MUTED}">${block.text}</p>`;
        case "list":
          return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px">${block.items
            .map(
              (item) => `<tr>
                <td width="18" valign="top" style="padding:0 0 9px;font-size:16px;line-height:1.75;color:${ACCENT}">•</td>
                <td valign="top" style="padding:0 0 9px;font-size:16px;line-height:1.75;color:${MUTED}">${item}</td>
              </tr>`,
            )
            .join("")}</table>`;
        case "button":
          return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 18px">
            <tr><td align="center" bgcolor="${ACCENT}" style="border-radius:12px">
              <a href="${block.href}" style="display:inline-block;padding:14px 30px;font-family:${FONT};font-size:16px;color:${INK};text-decoration:none;border-radius:12px">${block.label}</a>
            </td></tr>
          </table>`;
        case "art":
          return `<p style="margin:14px 0 10px;text-align:center"><img src="${block.src}" width="${block.width}" alt="${block.alt ?? ""}" style="display:inline-block;border:0;max-width:100%;height:auto"></p>`;
        case "fields":
          /* A work notice is read in two seconds on a phone. Label over value,
             each value its own tap target. */
          return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 18px;border-top:1px solid ${LINE}">${block.rows
            .map(
              ([label, value, href]) => `<tr>
                <td style="padding:11px 0;border-bottom:1px solid ${LINE}">
                  <div style="font-size:13px;line-height:1.5;color:${MUTED}">${label}</div>
                  <div style="font-size:17px;line-height:1.5;color:${INK}">${
                    href
                      ? `<a href="${href}" style="color:${INK};text-decoration:none">${value}</a>`
                      : value
                  }</div>
                </td>
              </tr>`,
            )
            .join("")}</table>`;
        case "quote":
          return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 18px">
            <tr><td bgcolor="${CREAM}" style="padding:16px 18px;border-radius:12px;font-size:16px;line-height:1.75;color:${INK}">${block.text}</td></tr>
          </table>`;
        case "actions":
          return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:2px 0 16px"><tr>${block.items
            .map(
              (item) => `<td style="padding-left:8px">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr><td align="center" bgcolor="${ACCENT}" style="border-radius:10px">
                    <a href="${item.href}" style="display:inline-block;padding:11px 20px;font-family:${FONT};font-size:15px;color:${INK};text-decoration:none;border-radius:10px">${item.label}</a>
                  </td></tr>
                </table>
              </td>`,
            )
            .join("")}</tr></table>`;
      }
    })
    .join("");

  const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${heading}</title></head>
<body style="margin:0;padding:0;background:${CREAM};font-family:${FONT}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${preheader}</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${CREAM}">
<tr><td align="center" style="padding:28px 14px">

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;background:#ffffff;border-radius:18px;overflow:hidden">

    <tr><td bgcolor="${SLATE}" style="padding:26px 30px" dir="rtl">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="40" valign="middle">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr><td width="34" height="34" align="center" valign="middle"
                      style="width:34px;height:34px;border:2px solid ${ACCENT};border-radius:50%;
                             font-size:15px;color:${ACCENT};line-height:34px">א</td></tr>
            </table>
          </td>
          <td valign="middle" style="padding-right:12px">
            <div style="font-size:17px;color:#ffffff;line-height:1.3">${settings.name}</div>
            <div style="font-size:12px;color:${ACCENT};line-height:1.5">${settings.tagline}</div>
          </td>
        </tr>
      </table>
    </td></tr>

    <tr><td style="padding:30px 30px 8px" dir="rtl">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px">
        <tr>
          <td width="26" valign="middle"><div style="width:22px;height:2px;background:${ACCENT};font-size:0">&nbsp;</div></td>
          <td valign="middle" style="padding-right:8px;font-size:13px;letter-spacing:2px;color:${ACCENT_INK}">${eyebrow}</td>
        </tr>
      </table>
      <h1 style="margin:0 0 18px;font-size:26px;line-height:1.25;color:${SLATE};font-weight:normal">${heading}</h1>
      ${body}
    </td></tr>

    <tr><td style="padding:6px 30px 26px" dir="rtl">
      <div style="border-top:1px solid ${LINE};padding-top:16px">
        <p style="margin:0 0 6px;font-size:15px;line-height:1.7;color:${MUTED}">
          <a href="tel:${settings.phoneE164}" style="color:${ACCENT_INK};text-decoration:none">${settings.phoneDisplay}</a>
          &nbsp;·&nbsp;
          <a href="mailto:${settings.email}" style="color:${ACCENT_INK};text-decoration:none">${settings.email}</a>
          &nbsp;·&nbsp;
          <a href="${siteUrl}" style="color:${ACCENT_INK};text-decoration:none">${siteUrl.replace(/^https?:\/\//, "")}</a>
        </p>
        <p style="margin:0;font-size:13px;line-height:1.7;color:${MUTED}">${note}</p>
      </div>
    </td></tr>

  </table>

</td></tr>
</table>
</body></html>`;

  const text = [
    heading,
    "",
    ...blocks.flatMap((block) => {
      switch (block.kind) {
        case "lead":
        case "p":
          return [block.text.replace(/<[^>]+>/g, ""), ""];
        case "list":
          return [...block.items.map((item) => `· ${item.replace(/<[^>]+>/g, "")}`), ""];
        case "button":
          return [`${block.label}: ${block.href}`, ""];
        case "art":
          return [];
        case "fields":
          return [...block.rows.map(([label, value]) => `${label}: ${value}`), ""];
        case "quote":
          return [block.text.replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, ""), ""];
        case "actions":
          return [...block.items.map((item) => `${item.label}: ${item.href}`), ""];
      }
    }),
    `${settings.name} · ${settings.phoneDisplay} · ${settings.email}`,
    siteUrl,
    "",
    "—",
    note,
  ].join("\n");

  return { html, text };
}

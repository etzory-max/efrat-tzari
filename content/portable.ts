import type { PortableTextBlock } from "@portabletext/react";

/**
 * Tiny builders so the seed content can be written as readable Hebrew prose
 * while still being valid Portable Text — the same shape Sanity returns.
 * One renderer serves both sources.
 */
let key = 0;
const k = () => `s${(key += 1)}`;

export const p = (text: string): PortableTextBlock =>
  ({
    _type: "block",
    _key: k(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: k(), text, marks: [] }],
  }) as unknown as PortableTextBlock;

export const h2 = (text: string): PortableTextBlock =>
  ({
    _type: "block",
    _key: k(),
    style: "h2",
    markDefs: [],
    children: [{ _type: "span", _key: k(), text, marks: [] }],
  }) as unknown as PortableTextBlock;

export const li = (text: string): PortableTextBlock =>
  ({
    _type: "block",
    _key: k(),
    style: "normal",
    listItem: "bullet",
    level: 1,
    markDefs: [],
    children: [{ _type: "span", _key: k(), text, marks: [] }],
  }) as unknown as PortableTextBlock;

/* ------------------------------------------------------------------ *
 * A very small Markdown subset -> Portable Text.
 *
 * The three builders above cover plain prose, but the privacy policy and the
 * accessibility statement are full of inline links and bold run-ins, and
 * hand-writing markDefs for every one of them is unreadable. This takes the
 * documents as ordinary text and produces exactly the shape Sanity stores,
 * so the same paragraph can come from the seed or from the CMS and render
 * identically.
 *
 * Understood: blank-line-separated blocks, "## " headings, "- " bullets,
 * **bold** and [text](href). Nothing else — anything more and the right
 * answer is to write it in the Studio.
 * ------------------------------------------------------------------ */

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = { _type: "link"; _key: string; href: string };

const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;

/** Splits one line into spans, collecting any link definitions it carries. */
function inline(line: string): { children: Span[]; markDefs: MarkDef[] } {
  const children: Span[] = [];
  const markDefs: MarkDef[] = [];
  let at = 0;

  const push = (text: string, marks: string[]) => {
    if (text) children.push({ _type: "span", _key: k(), text, marks });
  };

  for (const match of line.matchAll(INLINE)) {
    push(line.slice(at, match.index), []);
    if (match[1] !== undefined) {
      push(match[1], ["strong"]);
    } else {
      const def: MarkDef = { _type: "link", _key: k(), href: match[3] };
      markDefs.push(def);
      push(match[2], [def._key]);
    }
    at = match.index + match[0].length;
  }
  push(line.slice(at), []);

  // An empty paragraph would render as a gap with no content behind it.
  if (children.length === 0) push("", []);
  return { children, markDefs };
}

const block = (
  line: string,
  extra: Record<string, unknown> = {},
): PortableTextBlock => {
  const { children, markDefs } = inline(line);
  return {
    _type: "block",
    _key: k(),
    style: "normal",
    markDefs,
    children,
    ...extra,
  } as unknown as PortableTextBlock;
};

export function md(source: string): PortableTextBlock[] {
  return source
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith("## ")) return block(line.slice(3), { style: "h2" });
      if (line.startsWith("- ")) return block(line.slice(2), { listItem: "bullet", level: 1 });
      // A pulled-out line - the renderer already styles blockquote, and a
      // chapter of a book is the first seed content long enough to want one.
      if (line.startsWith("> ")) return block(line.slice(2), { style: "blockquote" });
      return block(line);
    });
}

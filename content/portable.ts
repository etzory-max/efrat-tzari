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

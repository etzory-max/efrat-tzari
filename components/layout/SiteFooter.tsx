"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { BookFooter } from "@/components/layout/BookFooter";
import type { SiteSettings } from "@/lib/content";

/**
 * Which foot the page stands on. The layout renders one footer for the whole
 * site, so the choice is made here, by path, exactly as the header chooses
 * its menu.
 */
export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const onBookPage = usePathname()?.startsWith("/gentle-cracks") ?? false;
  return onBookPage ? <BookFooter settings={settings} /> : <Footer settings={settings} />;
}

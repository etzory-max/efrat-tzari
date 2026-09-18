import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";
import { LegalPage } from "@/components/layout/LegalPage";
import { proseComponents } from "@/components/ui/PortableProse";
import { getLegalPage } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getLegalPage("privacy");
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: "/privacy" },
  };
}

export default async function PrivacyPage() {
  const page = await getLegalPage("privacy");

  return (
    <LegalPage title={page.title} updatedAt={page.updatedAt} intro={page.intro}>
      <PortableText value={page.body} components={proseComponents} />
    </LegalPage>
  );
}

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Sanity webhook target. Point the project's webhook at
 * POST https://<domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 * so an edit in the Studio is live within seconds.
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const provided = new URL(request.url).searchParams.get("secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ revalidated: false, reason: "unauthorized" }, { status: 401 });
  }

  revalidateTag("content", "max");
  return NextResponse.json({ revalidated: true, at: Date.now() });
}

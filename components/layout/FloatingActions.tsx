import { AccessibilityMenu } from "./AccessibilityMenu";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.44 9.44 0 0 1-4.8-1.32l-.35-.2-3.57.93.96-3.47-.23-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.45-9.43a9.4 9.4 0 0 1 6.68 2.77 9.34 9.34 0 0 1 2.76 6.66c0 5.2-4.24 9.44-9.45 9.44zM20.15 3.9A11.28 11.28 0 0 0 12.05 .55C5.83.55.78 5.6.78 11.8c0 2 .52 3.94 1.52 5.66L.68 23.45l6.13-1.6a11.32 11.32 0 0 0 5.24 1.33h.01c6.22 0 11.28-5.05 11.28-11.25 0-3-1.17-5.83-3.19-7.95z" />
    </svg>
  );
}

/** Stacked in the corner, matching the demo's placement. */
export function FloatingActions({ whatsappHref }: { whatsappHref: string }) {
  return (
    // Physical left, matching the demo — not `start`, which would flip in RTL.
    <div
      data-site-chrome
      className="fixed bottom-6 left-6 z-40 flex flex-col items-start gap-3 print:hidden"
    >
      <div className="relative">
        <AccessibilityMenu />
      </div>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="tap inline-flex size-12 items-center justify-center rounded-full bg-[#1f8a4c] text-white shadow-lg transition-colors hover:bg-[#176c3b]"
      >
        <WhatsAppIcon className="size-6" />
        <span className="sr-only">שליחת הודעת וואטסאפ לאפרת (נפתח בחלון חדש)</span>
      </a>
    </div>
  );
}

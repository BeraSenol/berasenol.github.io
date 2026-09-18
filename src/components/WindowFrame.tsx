import type { ReactNode } from "react";

/**
 * The window both mock-ups sit in, so the chrome is described once.
 *
 * overflow-hidden on the frame, so the title bar's fill stops at the corner
 * radius instead of squaring it off.
 */
export function WindowFrame({
  address,
  children,
}: {
  address: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-surface">
      <div
        aria-hidden="true"
        className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border-b border-hairline bg-white/[0.04] px-4 py-3"
      >
        {/*
          Three columns rather than a flex row with a spacer: the middle column is
          centred on the frame itself, so the address stays put whatever the
          lights or the label measure.
        */}
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>

        <div className="flex justify-center">
          <span className="flex w-full max-w-[15rem] items-center justify-center gap-1.5 rounded-md bg-white/[0.07] px-3 py-1 text-[0.6875rem] text-ink-dim">
            <svg
              viewBox="0 0 17.5 25.2246"
              className="h-3 w-auto shrink-0"
              fill="currentColor"
            >
              <path d="M2.73438 24.5508L14.4043 24.5508C16.1523 24.5508 17.1387 23.5352 17.1387 21.6602L17.1387 12.7734C17.1387 10.9082 16.1523 9.89258 14.4043 9.89258L2.73438 9.89258C0.976562 9.89258 0 10.9082 0 12.7734L0 21.6602C0 23.5352 0.976562 24.5508 2.73438 24.5508ZM2.23633 10.7227L3.95508 10.7227L3.95508 6.72852C3.95508 3.47656 6.01562 1.63086 8.56445 1.63086C11.1133 1.63086 13.1934 3.47656 13.1934 6.72852L13.1934 10.7227L14.9121 10.7227L14.9121 6.93359C14.9121 2.38281 11.9434 0 8.56445 0C5.19531 0 2.23633 2.38281 2.23633 6.93359Z" />
            </svg>
            {address}
          </span>
        </div>

        {/* Balances the lights so the address sits on the frame's centre line. */}
        <div className="w-[52px]" />
      </div>

      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { LOCALES, type LocaleCode } from "../content/locales";
import { ChevronMark } from "./Glyphs";

type LanguageMenuProps = {
  /** The locale this page was built in. Comes from `content.lang`. */
  current: LocaleCode;
  /** The button's accessible name, in the current language. */
  label: string;
};

/**
 * The header's language control: a button showing the current locale, and a
 * menu of every locale the site exists in.
 *
 * The entries are still plain links. The URL remains the source of truth — this
 * navigates to another built page rather than swapping a dictionary in state —
 * so a reload, a bookmark or a pasted link all keep the language.
 */
export function LanguageMenu({ current, label }: LanguageMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentLocale =
    LOCALES.find((locale) => locale.code === current) ?? LOCALES[0];

  /*
   * Closing the menu depends on events that happen outside this component's own
   * markup: a click anywhere on the page, a key pressed while focus is
   * somewhere else entirely. React's onClick can't see those, so this is one of
   * the cases where an effect is the right tool — subscribe on open, unsubscribe
   * on close.
   *
   * `open` is in the dependency array, so the effect re-runs whenever it
   * changes: the cleanup tears the listeners down when the menu closes, and the
   * body puts them back when it reopens. Nothing is listening while the menu is
   * shut.
   *
   * pointerdown rather than click, because a click that lands on a link
   * elsewhere on the page would otherwise fire after the menu has already
   * swallowed it.
   */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (rootRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Escape should leave focus where the user can carry on tabbing from,
      // which is the button they opened, not the top of the document.
      buttonRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="language-menu"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="group -m-2.5 flex items-center p-2.5"
      >
        <span className="flex items-center gap-1.5 rounded-full border border-separator px-2.5 py-1 text-xs font-medium text-secondary transition-colors group-hover:border-tertiary group-hover:text-primary group-aria-expanded:border-tertiary group-aria-expanded:text-primary">
          {currentLocale.label}
          <ChevronMark
            className={`h-1.5 w-2.5 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/*
        Rendered only while open. The alternative — always in the DOM, hidden
        with a class — would leave the links keyboard-focusable and readable by
        a screen reader while the menu is shut.
      */}
      {open && (
        <ul
          id="language-menu"
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-36 overflow-hidden rounded-xl border border-separator bg-surface/95 py-1 shadow-xl shadow-black/40 backdrop-blur-xl"
        >
          {LOCALES.map((locale) => {
            const isCurrent = locale.code === current;

            return (
              // `key` is the locale code, not the array index: a stable identity
              // for the row, so React keeps the right DOM node against the right
              // entry if the list is ever reordered.
              <li key={locale.code} role="none">
                {isCurrent ? (
                  /*
                   * The current language is not a link. A link to the page you
                   * are already on is a full reload that changes nothing, and
                   * nothing about the row invites you to guess that.
                   */
                  <span
                    role="menuitem"
                    aria-current="true"
                    className="flex min-h-11 items-center justify-between gap-3 px-3.5 py-2 text-sm font-medium text-primary"
                  >
                    {locale.name}
                    <CheckMark className="h-2.5 w-3 text-accent" />
                  </span>
                ) : (
                  <a
                    role="menuitem"
                    href={locale.href}
                    hrefLang={locale.code}
                    lang={locale.code}
                    className="flex min-h-11 items-center justify-between gap-3 px-3.5 py-2 text-sm font-medium text-secondary transition-colors hover:bg-fill-quaternary hover:text-primary focus-visible:bg-fill-quaternary focus-visible:text-primary focus-visible:outline-none"
                  >
                    {locale.name}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** Local to the menu: the tick beside the language you are already reading. */
function CheckMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 10"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 5.2 4.4 8.6 11 1.4" />
    </svg>
  );
}

import { type FocusEvent, useEffect, useRef, useState } from "react";
import { LOCALES, type LocaleCode } from "../content/locales";
import { ChevronMark } from "./Glyphs";

type LanguageMenuProps = {
  /** The locale this page was built in. Comes from `content.lang`. */
  current: LocaleCode;
  /** Spoken after the visible locale code, in the current language. */
  label: string;
};

/**
 * The header's language control: a button showing the current locale, and a
 * list of every locale the site exists in.
 *
 * It is a disclosure, a button that shows and hides a list of links, and not
 * an ARIA menu. role="menu" promises application-style keyboard handling:
 * focus moves into the menu, arrow keys walk the items, Tab leaves it.
 * Screen readers change how they behave on the strength of that promise, so a
 * menu that does not keep it strands their users, and this one did not (the
 * arrow keys did nothing). Two links need none of it. Tab reaches them like
 * any other link, which is the pattern the ARIA Authoring Practices recommend
 * for site navigation.
 *
 * The entries are plain links. The URL remains the source of truth: this
 * navigates to another built page rather than swapping a dictionary in state,
 * so a reload, a bookmark or a pasted link all keep the language.
 */
export function LanguageMenu({ current, label }: LanguageMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentLocale =
    LOCALES.find((locale) => locale.code === current) ?? LOCALES[0];

  /*
   * Closing the list depends on events that happen outside this component's
   * own markup: a click anywhere on the page, a key pressed while focus is
   * somewhere else entirely. React's onClick can't see those, so this is one
   * of the cases where an effect is the right tool: subscribe on open,
   * unsubscribe on close.
   *
   * `open` is in the dependency array, so the effect re-runs whenever it
   * changes: the cleanup tears the listeners down when the list closes, and
   * the body puts them back when it reopens. Nothing is listening while the
   * list is shut.
   *
   * pointerdown rather than click, because a click that lands on a link
   * elsewhere on the page would otherwise fire after the list has already
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

  /*
   * Tabbing out of the list closes it, so it cannot be left hanging over the
   * page while focus is on the splash buttons below. React's onBlur bubbles,
   * like the DOM's focusout, so this one handler on the wrapper hears focus
   * leave the button or either link. relatedTarget is where focus is going:
   * an element outside the wrapper means the visitor has moved on. null means
   * focus went nowhere in particular, for instance a click on a part of the
   * list that is not a link, and that should not close anything; a click
   * outside is the pointerdown listener's job.
   */
  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (next && !event.currentTarget.contains(next)) setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative" onBlur={handleBlur}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="language-menu"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="group -m-2.5 flex items-center p-2.5"
      >
        {/*
          Deliberately not glass: the glass belongs to the list it opens, and
          a glass trigger sitting right above glass options reads as two
          stacked panels. A plain outline keeps the control quiet.

          The accessible name comes from the button's own text: the visible
          code, then the label for screen readers only, so it reads "EN,
          Change language". It used to be an aria-label of just "Change
          language", which replaced the text. The name has to contain what is
          on screen: someone using voice control says "click EN", and a
          button whose name has no "EN" in it does not answer.
        */}
        <span className="flex items-center gap-1.5 rounded-full border border-separator px-2.5 py-1 text-xs font-medium text-secondary transition-colors group-hover:border-tertiary group-hover:text-primary group-aria-expanded:border-tertiary group-aria-expanded:text-primary">
          {currentLocale.label}
          <span className="sr-only">, {label}</span>
          <ChevronMark
            className={`h-1.5 w-2.5 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>

      {/*
        Always in the DOM, and hidden with the hidden attribute while shut.
        hidden is display: none, which takes the links out of the tab order and
        out of the accessibility tree exactly as not rendering them did, and it
        means aria-controls always points at an element that exists.

        Concentric corners, the way Apple draws a menu: the panel is 22, its
        padding 6, so each row's highlight is 16. A highlight with the panel's
        own radius would pinch at the corners.
      */}
      <ul
        id="language-menu"
        hidden={!open}
        className="liquid-glass absolute right-0 top-full z-50 mt-2 min-w-40 rounded-[22px] p-1.5"
      >
        {LOCALES.map((locale) => {
          const isCurrent = locale.code === current;

          return (
            // `key` is the locale code, not the array index: a stable identity
            // for the row, so React keeps the right DOM node against the right
            // entry if the list is ever reordered.
            <li key={locale.code}>
              {isCurrent ? (
                /*
                 * The current language is not a link. A link to the page you
                 * are already on is a full reload that changes nothing, and
                 * nothing about the row invites you to guess that.
                 */
                <span
                  aria-current="true"
                  className="flex min-h-11 items-center justify-between gap-3 rounded-2xl px-3.5 py-2 text-sm font-medium text-primary"
                >
                  {locale.name}
                  <CheckMark className="h-2.5 w-3 text-accent" />
                </span>
              ) : (
                <a
                  href={locale.href}
                  hrefLang={locale.code}
                  lang={locale.code}
                  className="flex min-h-11 items-center justify-between gap-3 rounded-2xl px-3.5 py-2 text-sm font-medium text-secondary transition-colors hover:bg-fill-secondary hover:text-primary focus-visible:bg-fill-secondary focus-visible:text-primary focus-visible:outline-none"
                >
                  {locale.name}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Local to the list: the tick beside the language you are already reading. */
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

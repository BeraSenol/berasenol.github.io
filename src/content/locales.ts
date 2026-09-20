/**
 * Every locale the site is built in, in the order the menu lists them.
 *
 * This is deliberately *not* part of `Content`. The list is the same whichever
 * page you are on, so duplicating it into en.ts and nl.ts would mean adding a
 * third language in three places and getting a menu that disagrees with itself
 * if you missed one. Content holds what differs per locale; this holds what
 * doesn't.
 *
 * Each language is named in its own language — "Nederlands", not "Dutch". A
 * visitor who cannot read the current page can still recognise their own
 * language, and it saves translating every language name into every locale.
 */
export type LocaleCode = "en" | "nl";

export type Locale = {
  code: LocaleCode;
  /** Where that locale's page lives. Absolute: this is a user site at `/`. */
  href: string;
  /** The two-letter code on the button face. */
  label: string;
  /** The endonym, shown in the menu. */
  name: string;
};

export const LOCALES: readonly Locale[] = [
  { code: "en", href: "/en/", label: "EN", name: "English" },
  { code: "nl", href: "/nl/", label: "NL", name: "Nederlands" },
];

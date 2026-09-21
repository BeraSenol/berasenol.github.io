/**
 * The shape of one locale's copy.
 *
 * Every locale file is typed as `Content`, so leaving a key out of the Dutch
 * version is a compile error rather than an English string appearing on the
 * Dutch page. This is the whole reason the content lives in TypeScript and not
 * in JSON.
 */
import type { LocaleCode } from "./locales";

export type NuggetIcon = "note" | "leaf" | "star" | "cup" | "cake" | "yen";

export type Nugget = { icon: NuggetIcon; label: string };

export type Feature = { title: string; body: string };

/**
 * One language and how well it is known, 0 to 100, as the CV draws it.
 * `native` replaces the old trailing asterisk in the name: the asterisk is a
 * rendering decision, and a name with punctuation baked into it is a name you
 * cannot use anywhere else, for instance as an accessible label.
 */
export type LanguageSkill = { name: string; level: number; native?: boolean };

export type Study = { title: string; org: string; period: string };

export type Project = {
  name: string;
  stack: readonly string[];
  bullets: readonly string[];
  href?: string;
};

/** Which glyph stands in for the row's label. */
export type ContactIcon = "email" | "github" | "location";

/**
 * The label is no longer rendered as text, but it is still the row's name: it
 * becomes the glyph's accessible name, so a screen reader reads "Email" where
 * everyone else sees an envelope.
 */
export type ContactLink = {
  icon: ContactIcon;
  label: string;
  value: string;
  href?: string;
};

export type Content = {
  /** Goes into <html lang>, and into the hreflang pair. */
  lang: LocaleCode;
  /**
   * Accessible name for the header's language button. The list of languages
   * itself lives in locales.ts, because it is the same on every page.
   */
  languageMenuLabel: string;
  meta: { title: string; description: string };
  splash: {
    role: string;
    scrollLabel: string;
    githubLabel: string;
    contactCta: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    body: string;
  };
  kitchen: {
    eyebrow: string;
    title: string;
    tagline: string;
    toques: string;
    scoreLabel: string;
    paragraphs: readonly string[];
    exteriorAlt: string;
    exteriorCaption: string;
    trufflesAlt: string;
    trufflesCaption: string;
    memojiAlt: string;
  };
  dignify: {
    eyebrow: string;
    title: string;
    tagline: string;
    paragraphs: readonly string[];
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    memojiAlt: string;
  };
  dgt: {
    eyebrow: string;
    title: string;
    tagline: string;
    paragraphs: readonly string[];
    href: string;
    ctaLabel: string;
    boardLabel: string;
    boardCaption: string;
    screenAlt: string;
    /** Heading over the feature list beside the Mac. */
    featuresTitle: string;
    /** The feature list beside the Mac: a short name, then one sentence. */
    features: readonly Feature[];
  };
  education: readonly Study[];
  projects: readonly Project[];
  /** Mother tongues are flagged `native`, including the joke one (Java). */
  languages: {
    eyebrow: string;
    title: string;
    naturalLabel: string;
    programmingLabel: string;
    /** The footnote the asterisk points at. */
    nativeNote: string;
    natural: readonly LanguageSkill[];
    programming: readonly LanguageSkill[];
  };
  contactLinks: readonly ContactLink[];
  memojiAlt: string;
  /** Small asides that orbit the memoji on the splash. */
  nuggets: readonly Nugget[];
  footer: string;
};

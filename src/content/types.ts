/**
 * The shape of one locale's copy.
 *
 * Every locale file is typed as `Content`, so leaving a key out of the Dutch
 * version is a compile error rather than an English string appearing on the
 * Dutch page. This is the whole reason the content lives in TypeScript and not
 * in JSON.
 */
export type NuggetIcon = "note" | "leaf" | "star" | "cup" | "snap" | "japanese";

export type Nugget = { icon: NuggetIcon; label: string };

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
  lang: "en" | "nl";
  /** The other locale, for the switch in the header. */
  alternate: { lang: "en" | "nl"; href: string; label: string; title: string };
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
    primaryCta: string;
    secondaryCta: string;
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
    /** The panel is decorative, so the caption has to say so. */
    panelCaption: string;
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
  };
  education: readonly Study[];
  projects: readonly Project[];
  /** A trailing asterisk marks a mother tongue, including the joke one. */
  languages: { natural: readonly string[]; programming: readonly string[] };
  contactLinks: readonly ContactLink[];
  memojiAlt: string;
  /** Small asides that orbit the memoji on the splash. */
  nuggets: readonly Nugget[];
  footer: string;
};

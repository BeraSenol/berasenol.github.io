import { LanguageMenu } from "./LanguageMenu";
import type { Content } from "../content/types";

export function Header({ content }: { content: Content }) {
  /*
   * No nav links. About and Work went first, with their anchors; Contact has now
   * gone too, and the section it pointed at is the last thing on the page, so a
   * link that scrolls you to the bottom of a single page was doing very little.
   * The bar keeps the name, which is the way back up, and the language menu.
   *
   * The gutter classes are the same ladder Container uses, so the name lines up
   * with every section heading below it at every width.
   */
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-separator">
      {/*
        The bar's own blur lives on this layer, not on the header. An element
        with backdrop-filter becomes a backdrop root: anything inside it that
        blurs its own backdrop can only see as far back as that element. The
        language menu hangs below the bar but is still inside the header, so
        with the filter on the header its glass would blur nothing and show
        the page through it sharp. As a sibling layer behind the nav, the bar
        looks the same and the menu can see the page.
      */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-canvas/70 backdrop-blur-xl" />
      <nav
        aria-label="Primary"
        className="flex h-12 w-full items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16"
      >
        <a
          href="#top"
          className="-mx-2 flex h-full items-center px-2 text-sm font-semibold tracking-tight text-primary transition-opacity hover:opacity-70"
        >
          Bera Senol
        </a>
        <LanguageMenu current={content.lang} label={content.languageMenuLabel} />
      </nav>
    </header>
  );
}

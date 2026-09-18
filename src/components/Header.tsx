import type { Content } from '../content/types'

export function Header({ content }: { content: Content }) {
  /*
   * About and Work are gone, and their anchors with them. A nav that scrolls to
   * a section that no longer exists is worse than a short nav.
   */
  const links = [{ href: '#contact', label: content.nav.contact }]

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline/80 bg-canvas/70 backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between px-6"
      >
        <a
          href="#top"
          className="text-sm font-semibold tracking-tight text-ink transition-opacity hover:opacity-70"
        >
          Bera Senol
        </a>
        <ul className="flex items-center gap-7">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-xs text-ink-dim transition-colors hover:text-ink">
                {link.label}
              </a>
            </li>
          ))}
          <li>
            {/*
              A plain link to the other locale's URL, not a state toggle. The URL is
              the source of truth, so the switch survives a reload and a paste.
              hrefLang tells crawlers and assistive tech what is on the other end.
            */}
            <a
              href={content.alternate.href}
              hrefLang={content.alternate.lang}
              lang={content.alternate.lang}
              title={content.alternate.title}
              className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-medium text-ink-dim transition-colors hover:border-white/40 hover:text-ink"
            >
              {content.alternate.label}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

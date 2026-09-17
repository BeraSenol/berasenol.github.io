const links = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#contact', label: 'Contact' },
]

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline/80 bg-canvas/70 backdrop-blur-xl">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-12 max-w-5xl items-center justify-between px-6"
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
              <a
                href={link.href}
                className="text-xs text-ink-dim transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

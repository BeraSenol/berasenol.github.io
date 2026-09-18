import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
}

/**
 * The page's one horizontal measure: max-w-7xl with a consistent gutter.
 * Every section aligns to this, so their left edges line up down the page.
 * Reading width is a separate, narrower constraint applied to prose inside.
 */
export function Container({ children, className = '' }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-7xl px-6 ${className}`}>{children}</div>
}

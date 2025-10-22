import * as React from 'react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  children: React.ReactNode
  className?: string
}

export function Navbar({ children, className }: NavbarProps) {
  return (
    <nav className={cn('flex items-center justify-between px-4 py-2 bg-surface-container border-b border-border', className)}>
      {children}
    </nav>
  )
}

interface NavbarSectionProps {
  children: React.ReactNode
  className?: string
}

export function NavbarSection({ children, className }: NavbarSectionProps) {
  return (
    <div className={cn('flex items-center space-x-4', className)}>
      {children}
    </div>
  )
}

export function NavbarSpacer() {
  return <div className="flex-1" />
}

interface NavbarItemProps {
  href?: string
  children: React.ReactNode
  className?: string
  'aria-label'?: string
  onClick?: () => void
}

export function NavbarItem({ href, children, className, onClick, ...props }: NavbarItemProps) {
  const itemClasses = cn(
    'p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-variant transition-colors',
    className
  )

  if (href) {
    return (
      <a href={href} className={itemClasses} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={itemClasses} {...props}>
      {children}
    </button>
  )
}
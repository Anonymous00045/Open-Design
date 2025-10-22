import * as React from 'react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  children: React.ReactNode
  className?: string
}

export function Sidebar({ children, className }: SidebarProps) {
  return (
    <div className={cn('flex flex-col h-full bg-black/20 backdrop-blur-sm border-r border-white/10', className)}>
      {children}
    </div>
  )
}

interface SidebarHeaderProps {
  children: React.ReactNode
  className?: string
}

export function SidebarHeader({ children, className }: SidebarHeaderProps) {
  return (
    <div className={cn('p-4 border-b border-white/10', className)}>
      {children}
    </div>
  )
}

interface SidebarBodyProps {
  children: React.ReactNode
  className?: string
}

export function SidebarBody({ children, className }: SidebarBodyProps) {
  return (
    <div className={cn('flex-1 overflow-y-auto p-4', className)}>
      {children}
    </div>
  )
}

interface SidebarFooterProps {
  children: React.ReactNode
  className?: string
}

export function SidebarFooter({ children, className }: SidebarFooterProps) {
  return (
    <div className={cn('p-4 border-t border-white/10', className)}>
      {children}
    </div>
  )
}

interface SidebarSectionProps {
  children: React.ReactNode
  className?: string
}

export function SidebarSection({ children, className }: SidebarSectionProps) {
  return (
    <div className={cn('space-y-1 mb-6', className)}>
      {children}
    </div>
  )
}

interface SidebarHeadingProps {
  children: React.ReactNode
  className?: string
}

export function SidebarHeading({ children, className }: SidebarHeadingProps) {
  return (
    <h3 className={cn('px-3 text-xs font-semibold text-white/70 uppercase tracking-wider mb-2', className)}>
      {children}
    </h3>
  )
}

interface SidebarItemProps {
  href?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function SidebarItem({ href, children, className, onClick }: SidebarItemProps) {
  const itemClasses = cn(
    'flex items-center px-3 py-2 text-sm font-medium rounded-md text-white/90 hover:bg-white/10 transition-colors',
    className
  )

  if (href) {
    return (
      <a href={href} className={itemClasses}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={cn(itemClasses, 'w-full text-left')}>
      {children}
    </button>
  )
}

interface SidebarLabelProps {
  children: React.ReactNode
  className?: string
}

export function SidebarLabel({ children, className }: SidebarLabelProps) {
  return <span className={cn('ml-3', className)}>{children}</span>
}

export function SidebarSpacer() {
  return <div className="flex-1" />
}
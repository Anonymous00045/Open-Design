import * as React from 'react'
import { cn } from '@/lib/utils'

interface SidebarLayoutProps {
  navbar?: React.ReactNode
  sidebar: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function SidebarLayout({ navbar, sidebar, children, className }: SidebarLayoutProps) {
  return (
    <div className={cn('flex h-screen bg-background', className)}>
      {/* Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        {sidebar}
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        {navbar && (
          <div className="flex-shrink-0">
            {navbar}
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
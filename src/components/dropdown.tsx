import * as React from 'react'
import { Menu, Transition } from '@headlessui/react'
import { cn } from '@/lib/utils'

interface DropdownProps {
  children: React.ReactNode
}

export function Dropdown({ children }: DropdownProps) {
  return <Menu as="div" className="relative inline-block text-left">{children}</Menu>
}

interface DropdownButtonProps {
  as?: React.ElementType
  children: React.ReactNode
  className?: string
}

export function DropdownButton({ as: Component = Menu.Button, children, className }: DropdownButtonProps) {
  return (
    <Component className={cn('inline-flex w-full justify-center', className)}>
      {children}
    </Component>
  )
}

interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
  anchor?: 'bottom start' | 'bottom end' | 'top start' | 'top end'
}

export function DropdownMenu({ children, className, anchor = 'bottom start' }: DropdownMenuProps) {
  const anchorClasses = {
    'bottom start': 'left-0 mt-2',
    'bottom end': 'right-0 mt-2',
    'top start': 'left-0 mb-2 bottom-full',
    'top end': 'right-0 mb-2 bottom-full',
  }

  return (
    <Transition
      as={React.Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        className={cn(
          'absolute z-10 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-border focus:outline-none',
          anchorClasses[anchor],
          className
        )}
      >
        <div className="py-1">{children}</div>
      </Menu.Items>
    </Transition>
  )
}

interface DropdownItemProps {
  href?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function DropdownItem({ href, children, className, onClick }: DropdownItemProps) {
  return (
    <Menu.Item>
      {({ active }) => {
        const itemClasses = cn(
          'flex items-center px-4 py-2 text-sm',
          active ? 'bg-accent text-accent-foreground' : 'text-popover-foreground',
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
      }}
    </Menu.Item>
  )
}

interface DropdownLabelProps {
  children: React.ReactNode
  className?: string
}

export function DropdownLabel({ children, className }: DropdownLabelProps) {
  return <span className={cn('ml-3', className)}>{children}</span>
}

export function DropdownDivider() {
  return <div className="my-1 h-px bg-border" />
}
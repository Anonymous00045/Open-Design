import * as React from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  initials?: string
  square?: boolean
  slot?: string
}

export function Avatar({ 
  src, 
  initials, 
  square = false, 
  className, 
  alt = '',
  ...props 
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'inline-block object-cover',
          square ? 'rounded-lg' : 'rounded-full',
          'h-8 w-8',
          className
        )}
        {...props}
      />
    )
  }

  if (initials) {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center font-medium text-white',
          square ? 'rounded-lg' : 'rounded-full',
          'h-8 w-8 bg-gray-500',
          className
        )}
      >
        <span className="text-sm">{initials}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-block',
        square ? 'rounded-lg' : 'rounded-full',
        'h-8 w-8 bg-gray-300',
        className
      )}
    />
  )
}
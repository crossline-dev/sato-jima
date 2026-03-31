import type { ReactNode } from 'react'
import { cn } from '@/utils/classes'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 md:px-8 lg:max-w-7xl lg:px-12 xl:px-15',
        className,
      )}>
      {children}
    </div>
  )
}

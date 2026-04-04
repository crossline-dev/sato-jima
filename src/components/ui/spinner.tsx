import { CircleNotch } from '@phosphor-icons/react/ssr'
import { cn } from '@/utils/classes'

interface SpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <CircleNotch className={cn('animate-spin', sizeClasses[size], className)} />
  )
}

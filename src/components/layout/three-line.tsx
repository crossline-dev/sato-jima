import { cn } from '@/utils/classes'

interface ThreeLineProps {
  weight?: 'light' | 'normal'
  color?: 'light' | 'normal'
  rotate?: boolean
  className?: string
}

export function ThreeLine({
  weight = 'normal',
  color = 'normal',
  rotate = false,
  className,
}: ThreeLineProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-0.5',
        rotate && 'rotate-180',
        color === 'light' && 'gap-0.5',
        className,
      )}>
      <div
        className={cn(
          'block w-full',
          weight === 'light' && 'h-0.5',
          weight === 'normal' && 'h-1',
          color === 'light' && 'bg-red-200/50',
          color === 'normal' && 'bg-red-500',
        )}
      />
      <div
        className={cn(
          'block w-full',
          weight === 'light' && 'h-0.5',
          weight === 'normal' && 'h-1',
          color === 'light' && 'bg-blue-200/65',
          color === 'normal' && 'bg-blue-500',
        )}
      />
      <div
        className={cn(
          'block w-full',
          weight === 'light' && 'h-0.5',
          weight === 'normal' && 'h-1',
          color === 'light' && 'bg-green-200/65',
          color === 'normal' && 'bg-green-500',
        )}
      />
    </div>
  )
}

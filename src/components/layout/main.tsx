import { cn } from '@/utils/classes'

interface MainProps {
  children: React.ReactNode
  className?: string
}

export function Main({ children, className }: MainProps) {
  return <main className={cn('mt-16 pb-16', className)}>{children}</main>
}

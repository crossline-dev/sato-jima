import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/utils/classes'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-sans',
  {
    variants: {
      variant: {
        default:
          'bg-background text-foreground border border-foreground hover:bg-foreground hover:text-background transition-all duration-300',
        accent:
          'bg-primary text-primary-foreground border border-primary hover:bg-transparent hover:text-primary transition-all duration-300',
        outline:
          'bg-transparent text-foreground border border-foreground hover:bg-foreground hover:text-background transition-all duration-300',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline lowercase normal-case tracking-normal font-normal',
        'chantilly-link':
          'text-primary hover:opacity-70 transition-opacity font-medium text-[10px] tracking-[0.1em]',
      },
      size: {
        default: 'h-12 px-6 py-3',
        sm: 'h-9 px-3',
        lg: 'h-14 px-10 text-base',
        icon: 'h-10 w-10',
        link: 'h-auto p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }

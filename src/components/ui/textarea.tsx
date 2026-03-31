import type * as React from 'react'

import { cn } from '@/utils/classes'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'field-sizing-content flex min-h-60 w-full rounded-md border border-input bg-transparent px-3 py-2.5 text-base outline-none transition-[color,box-shadow] placeholder:text-muted-foreground/40 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:ring-destructive/40',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap text-xs font-bold uppercase tracking-[0.15em] outline-none transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90',
        accent: 'bg-accent text-[#071a2f] hover:-translate-y-0.5 hover:brightness-105',
        outline: 'border border-border bg-transparent text-foreground hover:border-accent hover:text-accent-foreground',
        outlineInverse: 'border border-white/50 bg-transparent text-white hover:border-accent hover:text-accent',
        ghost: 'bg-transparent text-foreground hover:bg-muted',
        destructive: 'bg-destructive text-destructive-foreground hover:brightness-105',
        link: 'text-primary underline decoration-accent underline-offset-4 hover:text-accent-foreground',
      },
      size: {
        default: 'px-6 py-3.5',
        sm: 'px-4 py-2.5 text-[10px]',
        lg: 'px-7 py-4',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
)
Button.displayName = 'Button'

export { Button, buttonVariants }

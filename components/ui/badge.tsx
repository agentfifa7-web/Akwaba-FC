import { cn } from '@/lib/utils'

const styles: Record<string, string> = {
  default: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-[#071a2f]',
  primary: 'bg-primary text-primary-foreground',
  outline: 'border border-border text-foreground',
  live: 'bg-live text-white',
  success: 'bg-success text-white',
  destructive: 'bg-destructive text-destructive-foreground',
}

export function Badge({
  className,
  tone = 'default',
  children,
}: {
  className?: string
  tone?: keyof typeof styles
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em]',
        styles[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

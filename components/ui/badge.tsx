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
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] shadow-sm transition-transform duration-300 hover:scale-105',
        styles[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping-live absolute inline-flex h-full w-full rounded-full bg-white" />
      <span className="animate-pulse-live relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
    </span>
  )
}

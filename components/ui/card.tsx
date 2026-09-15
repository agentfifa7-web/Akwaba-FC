import { cn } from '@/lib/utils'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border border-border bg-card text-card-foreground', className)} {...props} />
}

export function StatBlock({ label, value, tone }: { label: string; value: React.ReactNode; tone?: 'accent' }) {
  return (
    <div className="p-5">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={cn('mt-2 font-display text-4xl font-bold', tone === 'accent' && 'text-accent-foreground')}>
        {value}
      </p>
    </div>
  )
}

export function SectionKicker({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground"><span className="h-px w-8 bg-accent" />{children}</p>
}

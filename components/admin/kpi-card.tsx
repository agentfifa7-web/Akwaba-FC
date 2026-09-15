import type { LucideIcon } from 'lucide-react'

export function KpiCard({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon: LucideIcon }) {
  return (
    <div className="flex items-center gap-4 border border-border bg-card p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-3xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  )
}

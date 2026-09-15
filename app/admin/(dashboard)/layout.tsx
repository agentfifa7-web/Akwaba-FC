import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { ROLE_LABELS } from '@/lib/constants'
import { AdminSidebarNav } from '@/components/admin/sidebar-nav'
import { LogoutButton } from '@/components/admin/logout-button'

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-secondary text-foreground">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-primary text-white lg:flex">
          <Link href="/admin" className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent font-display text-[10px] font-bold text-accent">
              AFC
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em]">Administration</div>
          </Link>
          <AdminSidebarNav role={session.role} />
          <div className="border-t border-white/10 px-6 py-5">
            <p className="text-xs font-bold text-white">{session.name}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-accent">{ROLE_LABELS[session.role]}</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/" className="text-[10px] font-semibold uppercase tracking-widest text-white/50 hover:text-white">
                ← Retour au site
              </Link>
              <LogoutButton />
            </div>
          </div>
        </aside>

        <div className="min-h-screen flex-1">
          <header className="flex items-center justify-between border-b border-border bg-card px-5 py-4 lg:hidden">
            <span className="text-xs font-bold uppercase tracking-widest">Administration AKWABA FC</span>
            <LogoutButton compact />
          </header>
          <main className="p-5 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

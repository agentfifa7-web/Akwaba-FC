import Link from 'next/link'
import { CalendarDays, Newspaper, Video, UserSquare2, Eye, Bell, Ticket, GraduationCap } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { KpiCard } from '@/components/admin/kpi-card'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>
}) {
  const { denied } = await searchParams
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const [
    upcomingMatches,
    newsCount,
    videosCount,
    playersCount,
    viewsToday,
    latestNews,
    latestApplications,
    pendingTicketOrders,
  ] = await Promise.all([
    prisma.match.count({ where: { date: { gte: new Date() }, status: 'SCHEDULED' } }),
    prisma.newsArticle.count(),
    prisma.video.count(),
    prisma.player.count({ where: { active: true } }),
    prisma.pageView.count({ where: { date: { gte: startOfToday } } }),
    prisma.newsArticle.findMany({ orderBy: { publishedAt: 'desc' }, take: 5 }),
    prisma.academyApplication.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.ticketOrder.count({ where: { status: 'PENDING' } }),
  ])

  return (
    <div className="space-y-8">
      {denied && (
        <p className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs font-semibold text-destructive">
          Vous n’avez pas les droits nécessaires pour accéder à cette section.
        </p>
      )}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent-foreground">Vue d’ensemble</p>
        <h1 className="mt-2 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">Tableau de bord</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Matchs à venir" value={upcomingMatches} icon={CalendarDays} />
        <KpiCard label="Actualités" value={newsCount} icon={Newspaper} />
        <KpiCard label="Vidéos" value={videosCount} icon={Video} />
        <KpiCard label="Joueurs actifs" value={playersCount} icon={UserSquare2} />
        <KpiCard label="Visiteurs aujourd'hui" value={viewsToday} icon={Eye} />
        <KpiCard label="Commandes billetterie en attente" value={pendingTicketOrders} icon={Ticket} />
        <KpiCard label="Candidatures Academy" value={latestApplications.length} icon={GraduationCap} />
        <KpiCard label="Notifications" value="Gérer" icon={Bell} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold uppercase">Derniers contenus publiés</h2>
            <Link href="/admin/news" className="text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
              Voir tout
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {latestNews.map((article) => (
              <li key={article.id} className="flex items-center justify-between py-3 text-sm">
                <span className="line-clamp-1 font-semibold">{article.title}</span>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {format(article.publishedAt, 'd MMM yyyy', { locale: fr })}
                </span>
              </li>
            ))}
            {latestNews.length === 0 && <p className="py-4 text-sm text-muted-foreground">Aucune actualité publiée.</p>}
          </ul>
        </div>

        <div className="border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold uppercase">Candidatures Academy récentes</h2>
            <Link href="/admin/academy-applications" className="text-[10px] font-bold uppercase tracking-widest text-accent-foreground">
              Voir tout
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {latestApplications.map((application) => (
              <li key={application.id} className="flex items-center justify-between py-3 text-sm">
                <span className="font-semibold">
                  {application.firstName} {application.lastName}
                </span>
                <span className="shrink-0 text-[11px] uppercase text-muted-foreground">{application.category}</span>
              </li>
            ))}
            {latestApplications.length === 0 && <p className="py-4 text-sm text-muted-foreground">Aucune candidature reçue.</p>}
          </ul>
        </div>
      </div>
    </div>
  )
}

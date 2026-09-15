import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { MobileTabBar } from '@/components/site/mobile-tab-bar'

export function SiteChrome({
  children,
  transparent = false,
}: {
  children: React.ReactNode
  transparent?: boolean
}) {
  return (
    <>
      <Navbar transparent={transparent} />
      <main className="min-h-screen overflow-hidden bg-background pb-16 text-foreground lg:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
    </>
  )
}

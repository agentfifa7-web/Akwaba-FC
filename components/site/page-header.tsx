import { Reveal } from '@/components/ui/motion'

export function PageHeader({
  kicker,
  title,
  accentTitle,
  description,
  image,
}: {
  kicker: string
  title: string
  accentTitle?: string
  description?: string
  image?: string
}) {
  return (
    <section className="relative flex min-h-[320px] items-end overflow-hidden bg-primary pb-14 pt-32 text-white sm:min-h-[400px] sm:pb-20 sm:pt-40">
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,8,13,.97)_8%,rgba(5,8,13,.5)_100%)]" />
        </>
      )}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-accent backdrop-blur-sm">
            {kicker}
          </p>
          <h1 className="font-display text-5xl font-black uppercase leading-[.92] tracking-[-0.02em] sm:text-7xl">
            {title}
            {accentTitle && (
              <>
                {' '}
                <span className="text-gradient-gold">{accentTitle}</span>
              </>
            )}
          </h1>
          {description && <p className="mt-5 max-w-xl text-sm leading-6 text-white/70 sm:text-base">{description}</p>}
        </Reveal>
      </div>
    </section>
  )
}

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
    <section className="relative flex min-h-[320px] items-end bg-primary pb-12 pt-32 text-white sm:min-h-[380px] sm:pb-16 sm:pt-40">
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,8,13,.97)_10%,rgba(5,8,13,.55)_100%)]" />
        </>
      )}
      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
            <span className="h-px w-10 bg-accent" /> {kicker}
          </p>
          <h1 className="font-display text-5xl font-black uppercase leading-[.92] tracking-[-0.02em] sm:text-7xl">
            {title}
            {accentTitle && (
              <>
                {' '}
                <span className="text-accent">{accentTitle}</span>
              </>
            )}
          </h1>
          {description && <p className="mt-5 max-w-xl text-sm leading-6 text-white/70 sm:text-base">{description}</p>}
        </Reveal>
      </div>
    </section>
  )
}

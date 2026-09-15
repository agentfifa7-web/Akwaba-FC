import { Reveal } from '@/components/ui/motion'

type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'stat'; label: string; value: string }
  | { type: 'image'; url: string; caption?: string }

export function CmsBlocks({ blocks }: { blocks: unknown }) {
  const list = Array.isArray(blocks) ? (blocks as Block[]) : []
  const paragraphs = list.filter((b) => b.type === 'paragraph') as Extract<Block, { type: 'paragraph' }>[]
  const stats = list.filter((b) => b.type === 'stat') as Extract<Block, { type: 'stat' }>[]
  const images = list.filter((b) => b.type === 'image') as Extract<Block, { type: 'image' }>[]

  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-5">
        {paragraphs.map((p, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <p className="text-base leading-7 text-foreground/80">{p.text}</p>
          </Reveal>
        ))}
      </div>
      {stats.length > 0 && (
        <Reveal className="grid grid-cols-2 gap-4 border border-border sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className={`p-6 ${i > 0 ? 'border-l border-border' : ''}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <p className="mt-2 font-display text-3xl font-black text-accent-foreground">{s.value}</p>
            </div>
          ))}
        </Reveal>
      )}
      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((im, i) => (
            <Reveal key={i} delay={i * 0.05} className="overflow-hidden">
              <img src={im.url} alt={im.caption ?? ''} className="aspect-[4/3] w-full object-cover" />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}

type Block =
  | { type: 'text'; text: string }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'video'; url: string }
  | { type: 'gallery'; images: string[] }

export function NewsBlocks({ blocks }: { blocks: unknown }) {
  const list = Array.isArray(blocks) ? (blocks as Block[]) : []
  return (
    <div className="space-y-8">
      {list.map((block, i) => {
        if (block.type === 'text') {
          return (
            <p key={i} className="text-base leading-7 text-foreground/85">
              {block.text}
            </p>
          )
        }
        if (block.type === 'quote') {
          return (
            <blockquote key={i} className="border-l-2 border-accent bg-secondary px-6 py-5 font-display text-xl italic text-primary">
              “{block.text}”
              {block.author && <cite className="mt-3 block text-xs font-bold uppercase not-italic tracking-widest text-muted-foreground">— {block.author}</cite>}
            </blockquote>
          )
        }
        if (block.type === 'image') {
          return (
            <figure key={i}>
              <img src={block.url} alt={block.caption ?? ''} className="w-full object-cover" />
              {block.caption && <figcaption className="mt-2 text-xs text-muted-foreground">{block.caption}</figcaption>}
            </figure>
          )
        }
        if (block.type === 'video') {
          return (
            <div key={i} className="aspect-video w-full bg-black">
              <video src={block.url} controls className="h-full w-full" />
            </div>
          )
        }
        if (block.type === 'gallery') {
          return (
            <div key={i} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {block.images.map((src, j) => (
                <img key={j} src={src} alt="" className="aspect-square w-full object-cover" />
              ))}
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

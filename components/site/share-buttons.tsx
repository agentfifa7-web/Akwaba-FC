'use client'

import { useEffect, useState } from 'react'
import { Link2, MessageCircle } from 'lucide-react'
import { FacebookIcon, XIcon } from '@/components/ui/social-icons'

export function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const links = [
    { icon: FacebookIcon, label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { icon: XIcon, label: 'X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}` },
    { icon: MessageCircle, label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
  ]

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Partager</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noreferrer" aria-label={l.label} className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground hover:border-accent-foreground hover:text-accent-foreground">
          <l.icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        aria-label="Copier le lien"
        onClick={() => {
          navigator.clipboard.writeText(url).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          })
        }}
        className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground hover:border-accent-foreground hover:text-accent-foreground"
      >
        <Link2 className="h-4 w-4" />
      </button>
      {copied && <span className="text-[10px] font-bold text-accent-foreground">Lien copié !</span>}
    </div>
  )
}

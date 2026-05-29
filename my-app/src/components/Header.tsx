import { MapPin, Waves } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-primary-dark to-primary px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] text-white shadow-lg">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <motion.span
            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur"
          >
            <Waves className="h-5 w-5" strokeWidth={2.4} />
          </motion.span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight">Conéctate Cartagena</h1>
            <p className="text-[11px] font-medium text-white/70">Tu ciudad, tus oportunidades</p>
          </div>
        </div>

        <span className="flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1.5 text-xs font-semibold ring-1 ring-accent/40 backdrop-blur text-accent">
          <MapPin className="h-3.5 w-3.5" strokeWidth={2.4} />
          Cartagena
        </span>
      </div>
    </header>
  )
}

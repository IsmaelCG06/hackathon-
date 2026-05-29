import { AlertTriangle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  text: string
  onAction?: () => void
}

export default function UrgencyBanner({ text, onAction }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-orange-400 p-3.5 text-white shadow-card"
    >
      <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-12 bg-white/25 blur-md animate-shine" />

      <div className="relative flex items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20 ring-1 ring-white/30">
          <AlertTriangle className="h-5 w-5" strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-white/80">
            Cierra mañana
          </p>
          <p className="truncate text-sm font-semibold">{text}</p>
        </div>
        <button
          type="button"
          onClick={onAction}
          className="group flex shrink-0 items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-red-600 transition-transform active:scale-95 hover:bg-white"
        >
          Ver detalles
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.6} />
        </button>
      </div>
    </motion.div>
  )
}

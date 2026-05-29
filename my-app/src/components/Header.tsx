import { Menu } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  onOpenSidebar: () => void
}

export default function Header({ onOpenSidebar }: Props) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-primary-dark to-primary px-4 pb-4 pt-[calc(env(safe-area-inset-top)+1rem)] text-white shadow-lg">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Abrir menú"
            className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur transition-colors hover:bg-white/25 active:scale-95"
          >
            <Menu className="h-5 w-5" strokeWidth={2.4} />
          </button>
          <div className="flex items-center gap-2.5">
            <motion.img
              src="/logo.png"
              alt="Conéctate Cartagena"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="h-10 w-10 rounded-2xl bg-white/10 p-1 ring-1 ring-white/15"
            />
            <div className="leading-tight">
              <h1 className="text-lg font-bold tracking-tight">Conéctate Cartagena</h1>
              <p className="text-[11px] font-medium text-white/70">Tu ciudad, tus oportunidades</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

import { Bell, Home, MapPin, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

const ITEMS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'map', label: 'Mapa', icon: MapPin },
  { id: 'community', label: 'Comunidad', icon: Users },
  { id: 'alerts', label: 'Alertas', icon: Bell },
]

interface Props {
  active: string
  onChange: (id: string) => void
  alertCount?: number
}

export default function BottomNav({ active, onChange, alertCount = 0 }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[1100] border-t border-slate-100 bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-stretch justify-around px-2 py-2">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active
          const showBadge = id === 'alerts' && alertCount > 0
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-semibold transition-colors ${
                isActive ? 'text-accent' : 'text-slate-400'
              }`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" strokeWidth={2.4} />
                {showBadge && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-tag-urgency-fg text-[9px] font-bold text-white">
                    {alertCount}
                  </span>
                )}
              </div>
              {label}
              {isActive && (
                <motion.span
                  layoutId="nav-dot"
                  className="absolute -top-0.5 h-1.5 w-1.5 rounded-full bg-accent"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

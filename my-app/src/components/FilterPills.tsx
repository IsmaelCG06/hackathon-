import { motion } from 'framer-motion'
import type { FilterKey } from '../types'

const FILTERS: FilterKey[] = ['Todas', 'Convocatorias', 'Mesas', 'Empleo', 'Formación']

interface Props {
  active: FilterKey
  onChange: (key: FilterKey) => void
}

export default function FilterPills({ active, onChange }: Props) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-1">
      {FILTERS.map((filter) => {
        const isActive = filter === active
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className="relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-primary shadow-card"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 ${
                isActive ? 'text-white' : 'text-slate-500'
              }`}
            >
              {filter}
            </span>
            {!isActive && (
              <span className="absolute inset-0 rounded-full bg-slate-100" />
            )}
          </button>
        )
      })}
    </div>
  )
}

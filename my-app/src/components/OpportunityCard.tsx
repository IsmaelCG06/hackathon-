import { ArrowRight, Building2, CalendarDays, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Category, Opportunity } from '../types'

const CATEGORY_STYLES: Record<Category, string> = {
  Convocatoria: 'bg-tag-blue-bg text-tag-blue-fg',
  Formación: 'bg-tag-green-bg text-tag-green-fg',
  Empleo: 'bg-tag-green-bg text-tag-green-fg',
  Mesa: 'bg-tag-purple-bg text-tag-purple-fg',
}

interface Props {
  opportunity: Opportunity
  onSelect: (opp: Opportunity) => void
}

export default function OpportunityCard({ opportunity, onSelect }: Props) {
  const { title, category, organization, location, date, cta, badge, urgent } = opportunity

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className="group flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-card ring-1 ring-slate-100 transition-shadow hover:shadow-card-hover"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${CATEGORY_STYLES[category]}`}
        >
          {category}
        </span>
        {badge && (
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
              urgent
                ? 'bg-tag-urgency-bg text-tag-urgency-fg'
                : 'bg-accent/15 text-accent'
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold leading-snug text-slate-800">{title}</h3>

      <div className="flex flex-col gap-1.5 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.2} />
          {organization}
          <span className="text-slate-300">·</span>
          <MapPin className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.2} />
          {location}
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-slate-400" strokeWidth={2.2} />
          {date}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onSelect(opportunity)}
        className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2.5 text-sm font-bold text-primary transition-colors group-hover:bg-accent group-hover:text-white"
      >
        {cta}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-1"
          strokeWidth={2.6}
        />
      </button>
    </motion.article>
  )
}

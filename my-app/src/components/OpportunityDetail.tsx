import { AnimatePresence, motion } from 'framer-motion'
import {
  Building2,
  CalendarDays,
  Clock,
  ExternalLink,
  MapPin,
  Navigation,
  Share2,
  X,
} from 'lucide-react'
import type { Category, Opportunity } from '../types'

const CATEGORY_STYLES: Record<Category, string> = {
  Convocatoria: 'bg-tag-blue-bg text-tag-blue-fg',
  Formación: 'bg-tag-green-bg text-tag-green-fg',
  Empleo: 'bg-tag-green-bg text-tag-green-fg',
  Mesa: 'bg-tag-purple-bg text-tag-purple-fg',
}

interface Props {
  opportunity: Opportunity | null
  onClose: () => void
  onNavigate: (opp: Opportunity) => void
}

export default function OpportunityDetail({ opportunity, onClose, onNavigate }: Props) {
  function handleShare() {
    if (!opportunity) return
    if (navigator.share) {
      navigator
        .share({
          title: opportunity.title,
          text: `${opportunity.title} — ${opportunity.organization}`,
          url: window.location.href,
        })
        .catch(() => null)
    } else {
      navigator.clipboard
        .writeText(`${opportunity.title} — ${opportunity.organization}`)
        .catch(() => null)
    }
  }

  return (
    <AnimatePresence>
      {opportunity && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1900] bg-primary-dark/50 backdrop-blur-sm"
          />

          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[2000] mx-auto max-w-2xl rounded-t-3xl bg-surface pb-[env(safe-area-inset-bottom)] shadow-card-hover"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3">
              <span className="h-1 w-10 rounded-full bg-slate-200" />
            </div>

            <div className="max-h-[80dvh] overflow-y-auto px-5 pb-6 pt-4">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    CATEGORY_STYLES[opportunity.category]
                  }`}
                >
                  {opportunity.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                  >
                    <Share2 className="h-4 w-4" strokeWidth={2.2} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                  >
                    <X className="h-4 w-4" strokeWidth={2.4} />
                  </button>
                </div>
              </div>

              <h2 className="mb-1 text-xl font-bold leading-snug text-primary-dark">
                {opportunity.title}
              </h2>

              {opportunity.badge && (
                <span
                  className={`mb-3 inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    opportunity.urgent
                      ? 'bg-tag-urgency-bg text-tag-urgency-fg'
                      : 'bg-accent/15 text-accent'
                  }`}
                >
                  {opportunity.badge}
                </span>
              )}

              {/* Meta */}
              <div className="mb-4 flex flex-col gap-2 rounded-2xl bg-body p-3">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <Building2 className="h-4 w-4 text-primary" strokeWidth={2.2} />
                  {opportunity.organization}
                </span>
                <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <MapPin className="h-4 w-4 text-primary" strokeWidth={2.2} />
                  {opportunity.location}, Cartagena
                </span>
                <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <CalendarDays className="h-4 w-4 text-primary" strokeWidth={2.2} />
                  {opportunity.date}
                </span>
              </div>

              {/* Descripción */}
              {opportunity.description && (
                <p className="mb-6 text-sm leading-relaxed text-slate-600">
                  {opportunity.description}
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                {opportunity.url ? (
                  <a
                    href={opportunity.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-base font-bold text-white shadow-accent-glow transition-all hover:bg-amber-600 active:scale-95"
                  >
                    {opportunity.cta}
                    <ExternalLink className="h-5 w-5" strokeWidth={2.6} />
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-200 py-3.5 text-base font-bold text-slate-400"
                  >
                    Próximamente
                    <Clock className="h-5 w-5" strokeWidth={2.6} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onNavigate(opportunity)
                    onClose()
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 border-primary/20 bg-primary/8 py-3 text-sm font-bold text-primary transition-all hover:border-primary/40 hover:bg-primary/15 active:scale-95"
                >
                  <Navigation className="h-4 w-4" strokeWidth={2.4} />
                  Cómo llegar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

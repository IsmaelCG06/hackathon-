import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, SearchX } from 'lucide-react'
import type { Opportunity } from '../types'
import OpportunityCard from './OpportunityCard'

interface Props {
  items: Opportunity[]
  onSelect: (opp: Opportunity) => void
}

export default function FeedSection({ items, onSelect }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold tracking-tight text-primary-dark">
          Oportunidades para ti
        </h2>
        <ArrowDownRight className="h-5 w-5 text-accent" strokeWidth={2.6} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <OpportunityCard key={item.id} opportunity={item} onSelect={onSelect} />
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-2 rounded-2xl bg-surface p-8 text-center shadow-card ring-1 ring-slate-100"
        >
          <SearchX className="h-8 w-8 text-slate-300" strokeWidth={2} />
          <p className="text-sm font-medium text-slate-500">
            No encontramos oportunidades. Prueba con otro filtro.
          </p>
        </motion.div>
      )}
    </section>
  )
}

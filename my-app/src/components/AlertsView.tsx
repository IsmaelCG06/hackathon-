import { motion } from 'framer-motion'
import { AlertTriangle, Bell, Sparkles } from 'lucide-react'
import type { Opportunity } from '../types'
import { useOpportunities } from '../data/OpportunitiesContext'
import OpportunityCard from './OpportunityCard'

interface Props {
  onSelectOpportunity: (opp: Opportunity) => void
}

export default function AlertsView({ onSelectOpportunity }: Props) {
  const { opportunities } = useOpportunities()
  const urgent = opportunities.filter((o) => o.urgent)
  const newItems = opportunities.filter((o) => !o.urgent && o.badge === 'Nuevo')
  const closingSoon = opportunities.filter(
    (o) => !o.urgent && o.badge && o.badge.startsWith('Cierra'),
  )

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pb-28 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-2"
      >
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-white">
          <Bell className="h-5 w-5" strokeWidth={2.4} />
        </span>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-primary-dark">Alertas</h2>
          <p className="text-xs text-slate-500">No pierdas ninguna oportunidad</p>
        </div>
      </motion.div>

      {urgent.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-red-500" strokeWidth={2.4} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-500">
              Cierra pronto
            </h3>
          </div>
          {urgent.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} onSelect={onSelectOpportunity} />
          ))}
        </section>
      )}

      {closingSoon.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-accent" strokeWidth={2.4} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
              Cierra esta semana
            </h3>
          </div>
          {closingSoon.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} onSelect={onSelectOpportunity} />
          ))}
        </section>
      )}

      {newItems.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" strokeWidth={2.4} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
              Nuevas
            </h3>
          </div>
          {newItems.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} onSelect={onSelectOpportunity} />
          ))}
        </section>
      )}

      {urgent.length === 0 && newItems.length === 0 && closingSoon.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-2xl bg-surface p-8 text-center shadow-card ring-1 ring-slate-100"
        >
          <Bell className="mx-auto mb-2 h-8 w-8 text-slate-300" strokeWidth={1.5} />
          <p className="text-sm font-medium text-slate-500">Sin alertas activas por ahora.</p>
        </motion.div>
      )}
    </main>
  )
}

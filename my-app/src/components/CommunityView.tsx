import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import type { Opportunity } from '../types'
import { useOpportunities } from '../data/OpportunitiesContext'
import OpportunityCard from './OpportunityCard'

interface Props {
  onSelectOpportunity: (opp: Opportunity) => void
}

export default function CommunityView({ onSelectOpportunity }: Props) {
  const { opportunities } = useOpportunities()
  const mesas = opportunities.filter((o) => o.category === 'Mesa')

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pb-28 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-white">
            <Users className="h-5 w-5" strokeWidth={2.4} />
          </span>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-primary-dark">Comunidad</h2>
            <p className="text-xs text-slate-500">Mesas y espacios de participación</p>
          </div>
        </div>
      </motion.div>

      {/* Descripción */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-white"
      >
        <p className="text-sm font-medium leading-relaxed">
          Las mesas de participación son espacios donde jóvenes de Cartagena se
          reúnen para proponer, debatir y construir soluciones a los problemas de
          su barrio y su ciudad. Tu voz importa.
        </p>
      </motion.div>

      {/* Lista de mesas */}
      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Mesas activas
        </h3>
        {mesas.length > 0 ? (
          mesas.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} onSelect={onSelectOpportunity} />
          ))
        ) : (
          <p className="rounded-2xl bg-surface p-6 text-center text-sm text-slate-400 shadow-card ring-1 ring-slate-100">
            No hay mesas activas en este momento.
          </p>
        )}
      </section>

      {/* Otras categorías relevantes */}
      {opportunities.filter((o) => o.category === 'Formación').length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Formación para líderes
          </h3>
          {opportunities
            .filter((o) => o.category === 'Formación')
            .map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onSelect={onSelectOpportunity}
              />
            ))}
        </section>
      )}
    </main>
  )
}

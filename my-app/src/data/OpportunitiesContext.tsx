import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Opportunity } from '../types'
import { opportunities as baseOpportunities } from './opportunities'

const STORAGE_KEY = 'cc_opportunities'

interface OpportunitiesContextValue {
  opportunities: Opportunity[]
  addOpportunity: (opp: Opportunity) => void
}

const OpportunitiesContext = createContext<OpportunitiesContextValue | null>(null)

export function OpportunitiesProvider({ children }: { children: ReactNode }) {
  const [created, setCreated] = useState<Opportunity[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as Opportunity[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(created))
  }, [created])

  const value = useMemo<OpportunitiesContextValue>(
    () => ({
      // Los eventos creados aparecen primero (más recientes arriba)
      opportunities: [...created, ...baseOpportunities],
      addOpportunity: (opp) => {
        setCreated((prev) => [opp, ...prev])
      },
    }),
    [created],
  )

  return (
    <OpportunitiesContext.Provider value={value}>{children}</OpportunitiesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOpportunities() {
  const ctx = useContext(OpportunitiesContext)
  if (!ctx) throw new Error('useOpportunities debe usarse dentro de <OpportunitiesProvider>')
  return ctx
}

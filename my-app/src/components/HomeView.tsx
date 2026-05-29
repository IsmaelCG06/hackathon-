import { useMemo, useState } from 'react'
import type { Category, FilterKey, Opportunity } from '../types'
import { kpis } from '../data/opportunities'
import { useOpportunities } from '../data/OpportunitiesContext'
import FilterPills from './FilterPills'
import SearchBar from './SearchBar'
import UrgencyBanner from './UrgencyBanner'
import KPISection from './KPISection'
import FeedSection from './FeedSection'

const FILTER_TO_CATEGORY: Partial<Record<FilterKey, Category>> = {
  Convocatorias: 'Convocatoria',
  Mesas: 'Mesa',
  Empleo: 'Empleo',
  Formación: 'Formación',
}

interface Props {
  onSelectOpportunity: (opp: Opportunity) => void
  onOpenFilters: () => void
  categoryFilter: Category[]
}

export default function HomeView({ onSelectOpportunity, onOpenFilters, categoryFilter }: Props) {
  const { opportunities } = useOpportunities()
  const [filter, setFilter] = useState<FilterKey>('Todas')
  const [query, setQuery] = useState('')

  const urgentOpp = opportunities.find((o) => o.urgent)

  const filtered = useMemo(() => {
    const pillCategory = FILTER_TO_CATEGORY[filter]
    const q = query.trim().toLowerCase()
    return opportunities.filter((o) => {
      const matchesPill = !pillCategory || o.category === pillCategory
      const matchesPanel =
        categoryFilter.length === 0 || categoryFilter.includes(o.category)
      const matchesQuery =
        !q ||
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q)
      return matchesPill && matchesPanel && matchesQuery
    })
  }, [filter, query, categoryFilter, opportunities])

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pb-28 pt-4">
      <SearchBar value={query} onChange={setQuery} onOpenFilters={onOpenFilters} />
      <FilterPills active={filter} onChange={setFilter} />
      {urgentOpp && (
        <UrgencyBanner
          text={urgentOpp.title}
          onAction={() => onSelectOpportunity(urgentOpp)}
        />
      )}
      <KPISection kpis={kpis} />
      <FeedSection items={filtered} onSelect={onSelectOpportunity} />
    </main>
  )
}

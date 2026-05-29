import { useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomeView from './components/HomeView'
import MapView from './components/MapView'
import CommunityView from './components/CommunityView'
import AlertsView from './components/AlertsView'
import OpportunityDetail from './components/OpportunityDetail'
import FilterPanel from './components/FilterPanel'
import type { Category, Opportunity } from './types'
import { opportunities } from './data/opportunities'

const alertCount = opportunities.filter((o) => o.urgent || o.badge === 'Nuevo').length

function App() {
  const [tab, setTab] = useState('home')
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<Category[]>([])
  const [routeTarget, setRouteTarget] = useState<Opportunity | null>(null)

  function handleSelectOpportunity(opp: Opportunity) {
    setSelectedOpportunity(opp)
  }

  function handleNavigate(opp: Opportunity) {
    setRouteTarget(opp)
    setTab('map')
  }

  return (
    <div className="min-h-dvh">
      <Header />

      {tab === 'home' && (
        <HomeView
          onSelectOpportunity={handleSelectOpportunity}
          onOpenFilters={() => setShowFilters(true)}
          categoryFilter={categoryFilter}
        />
      )}

      {tab === 'map' && (
        <MapView
          onSelectOpportunity={handleSelectOpportunity}
          routeTarget={routeTarget}
          onClearRoute={() => setRouteTarget(null)}
        />
      )}

      {tab === 'community' && (
        <CommunityView onSelectOpportunity={handleSelectOpportunity} />
      )}

      {tab === 'alerts' && (
        <AlertsView onSelectOpportunity={handleSelectOpportunity} />
      )}

      <BottomNav active={tab} onChange={setTab} alertCount={alertCount} />

      <OpportunityDetail
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        onNavigate={handleNavigate}
      />

      <FilterPanel
        open={showFilters}
        selected={categoryFilter}
        onClose={() => setShowFilters(false)}
        onApply={(cats) => setCategoryFilter(cats)}
      />
    </div>
  )
}

export default App

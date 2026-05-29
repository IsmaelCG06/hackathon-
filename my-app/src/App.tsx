import { useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import HomeView from './components/HomeView'
import MapView from './components/MapView'
import CommunityView from './components/CommunityView'
import AlertsView from './components/AlertsView'
import ProfileView from './components/ProfileView'
import OpportunityDetail from './components/OpportunityDetail'
import FilterPanel from './components/FilterPanel'
import Sidebar from './components/Sidebar'
import LoginScreen from './components/LoginScreen'
import CreateEventView from './components/CreateEventView'
import { useAuth } from './auth/AuthContext'
import { useOpportunities } from './data/OpportunitiesContext'
import type { Category, Opportunity } from './types'

function App() {
  const { user, logout } = useAuth()
  const { opportunities } = useOpportunities()
  const [tab, setTab] = useState('home')
  const [showSidebar, setShowSidebar] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<Category[]>([])
  const [routeTarget, setRouteTarget] = useState<Opportunity | null>(null)

  if (!user) {
    return <LoginScreen />
  }

  const isOrganization = user.type === 'organization'
  const alertCount = opportunities.filter((o) => o.urgent || o.badge === 'Nuevo').length

  function handleSelectOpportunity(opp: Opportunity) {
    setSelectedOpportunity(opp)
  }

  function handleNavigate(opp: Opportunity) {
    setRouteTarget(opp)
    setTab('map')
  }

  return (
    <div className="min-h-dvh">
      <Header onOpenSidebar={() => setShowSidebar(true)} />

      <Sidebar
        open={showSidebar}
        user={user}
        activeTab={tab}
        alertCount={alertCount}
        canCreate={isOrganization}
        onClose={() => setShowSidebar(false)}
        onChangeTab={setTab}
        onLogout={logout}
      />

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

      {tab === 'profile' && <ProfileView user={user} onLogout={logout} />}

      {tab === 'create' && isOrganization && (
        <CreateEventView organization={user.organization} onPublished={() => setTab('home')} />
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

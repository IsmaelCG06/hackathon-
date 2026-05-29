import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { motion, AnimatePresence } from 'framer-motion'
import { Locate, Navigation, X, Building2, CalendarDays } from 'lucide-react'
import type { Opportunity } from '../types'
import { useOpportunities } from '../data/OpportunitiesContext'
import { formatDistance, formatDuration, getRoute } from '../lib/ors'
import SearchBar from './SearchBar'
import OpportunityCard from './OpportunityCard'

// Cartagena centro
const CARTAGENA: [number, number] = [10.3997, -75.5144]

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Etiqueta tipo píldora con la fecha/badge del evento (estilo imagen 2) */
function makeIcon(opp: Opportunity) {
  const urgent = opp.urgent ?? false
  const label = (opp.badge || opp.date || 'Evento').trim()
  const html = `<span class="map-pin ${urgent ? 'map-pin--urgent' : ''}">${escapeHtml(label)}</span>`
  return L.divIcon({
    html,
    className: 'map-marker-icon',
    iconSize: undefined,
    iconAnchor: [0, 0],
    popupAnchor: [0, -16],
  })
}

function UserLocationMarker({ position }: { position: [number, number] | null }) {
  if (!position) return null
  const icon = L.divIcon({
    html: renderToStaticMarkup(
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#f59e0b',
          border: '3px solid #fff',
          boxShadow: '0 0 0 3px rgba(245,158,11,0.4)',
        }}
      />,
    ),
    className: 'map-marker-icon',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
  return <Marker position={position} icon={icon} />
}

function FlyToButton({ target }: { target: [number, number] }) {
  const map = useMap()
  return (
    <button
      type="button"
      onClick={() => map.flyTo(target, 15, { duration: 1.2 })}
      className="absolute bottom-24 right-3 z-[999] flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-card-hover ring-1 ring-slate-200"
    >
      <Locate className="h-5 w-5 text-primary" strokeWidth={2.4} />
    </button>
  )
}

/** Mantiene el tamaño del mapa sincronizado con su contenedor (arregla tiles parciales) */
function MapResize() {
  const map = useMap()
  useEffect(() => {
    map.invalidateSize()
    const container = map.getContainer()
    const ro = new ResizeObserver(() => map.invalidateSize())
    ro.observe(container)
    return () => ro.disconnect()
  }, [map])
  return null
}

/** Expone la instancia del mapa al componente padre */
function MapRefBridge({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap()
  useEffect(() => {
    onReady(map)
  }, [map, onReady])
  return null
}

interface RouteInfo {
  polyline: [number, number][]
  distance: number
  duration: number
}

export default function MapView({
  onSelectOpportunity,
  routeTarget,
  onClearRoute,
}: {
  onSelectOpportunity: (opp: Opportunity) => void
  routeTarget: Opportunity | null
  onClearRoute: () => void
}) {
  const { opportunities } = useOpportunities()
  const [userPos, setUserPos] = useState<[number, number] | null>(null)
  const [route, setRoute] = useState<RouteInfo | null>(null)
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [query, setQuery] = useState('')
  const mapRef = useRef<L.Map | null>(null)
  const markerRefs = useRef<Record<string, L.Marker | null>>({})

  // Geolocalización del usuario
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
      () => null,
    )
  }, [])

  // Calcular ruta ORS cuando llega un routeTarget
  useEffect(() => {
    if (!routeTarget) {
      setRoute(null)
      return
    }

    const from: [number, number] = userPos ?? CARTAGENA
    const to = routeTarget.coords

    setLoadingRoute(true)
    getRoute(from, to)
      .then((r) => {
        if (r) {
          setRoute(r)
          mapRef.current?.fitBounds(L.latLngBounds(r.polyline), { padding: [40, 40] })
        }
      })
      .finally(() => setLoadingRoute(false))
  }, [routeTarget, userPos])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return opportunities
    return opportunities.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q),
    )
  }, [query, opportunities])

  function focusOpportunity(opp: Opportunity) {
    mapRef.current?.flyTo(opp.coords, 15, { duration: 1.0 })
    markerRefs.current[opp.id]?.openPopup()
  }

  return (
    <div className="flex h-[calc(100dvh-7rem)] w-full">
      {/* Panel lateral: buscador + lista de eventos (solo en pantallas anchas) */}
      <aside className="hidden w-[360px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-slate-200 bg-body px-4 py-4 no-scrollbar lg:flex">
        <SearchBar value={query} onChange={setQuery} onOpenFilters={() => {}} />
        <p className="px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
          {filtered.length} {filtered.length === 1 ? 'evento' : 'eventos'}
        </p>
        <div className="flex flex-col gap-3">
          {filtered.map((opp) => (
            <div key={opp.id} onClick={() => focusOpportunity(opp)} className="cursor-pointer">
              <OpportunityCard opportunity={opp} onSelect={onSelectOpportunity} />
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="rounded-2xl bg-surface p-6 text-center text-sm font-medium text-slate-500 shadow-card ring-1 ring-slate-100">
              No encontramos eventos con esa búsqueda.
            </p>
          )}
        </div>
      </aside>

      {/* Columna del mapa */}
      <div className="relative h-full flex-1">
        <MapContainer
          center={CARTAGENA}
          zoom={13}
          className="h-full w-full"
          zoomControl={false}
        >
          <MapResize />
          <MapRefBridge onReady={(m) => (mapRef.current = m)} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains={['a', 'b', 'c', 'd']}
            maxZoom={20}
          />

          {/* Marcadores de oportunidades */}
          {opportunities.map((opp) => (
            <Marker
              key={opp.id}
              position={opp.coords}
              icon={makeIcon(opp)}
              ref={(ref) => {
                markerRefs.current[opp.id] = ref
              }}
            >
              <Popup>
                <div className="min-w-[200px] p-1">
                  <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    {opp.category}
                  </p>
                  <p className="mb-2 text-sm font-bold leading-snug text-slate-800">{opp.title}</p>
                  <div className="mb-3 flex flex-col gap-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 size={12} />
                      {opp.organization}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      {opp.date}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectOpportunity(opp)}
                    className="w-full rounded-lg bg-primary py-1.5 text-xs font-bold text-white"
                  >
                    Ver detalles
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Ubicación del usuario */}
          <UserLocationMarker position={userPos} />

          {/* Ruta ORS */}
          {route && (
            <Polyline
              positions={route.polyline}
              pathOptions={{ color: '#1e3a8a', weight: 5, opacity: 0.85, dashArray: '8, 4' }}
            />
          )}

          <FlyToButton target={userPos ?? CARTAGENA} />
        </MapContainer>

        {/* Leyenda */}
        <div className="absolute left-3 top-3 z-[999] flex flex-col gap-1.5 rounded-2xl bg-white/95 p-3 shadow-card ring-1 ring-slate-100 backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Leyenda</p>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <span className="h-3 w-3 rounded-full bg-primary" />
            Oportunidad
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-600">
            <span className="h-3 w-3 rounded-full bg-red-600" />
            Urgente
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-accent">
            <span className="h-3 w-3 rounded-full bg-accent ring-2 ring-white" />
            Tú
          </div>
        </div>

        {/* Banner de ruta activa */}
        <AnimatePresence>
          {(routeTarget || loadingRoute) && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="absolute inset-x-3 bottom-24 z-[999] rounded-2xl bg-primary p-4 text-white shadow-card-hover"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 shrink-0 text-accent" strokeWidth={2.4} />
                  <div>
                    <p className="text-xs font-bold text-white/70">Ruta a pie hacia</p>
                    <p className="text-sm font-bold leading-snug">{routeTarget?.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClearRoute}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15 hover:bg-white/25"
                >
                  <X className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </div>
              {loadingRoute && <p className="mt-2 text-xs text-white/60">Calculando ruta…</p>}
              {route && !loadingRoute && (
                <div className="mt-2 flex items-center gap-3">
                  <span className="rounded-full bg-accent/20 px-2.5 py-1 text-xs font-bold text-accent">
                    {formatDistance(route.distance)}
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/80">
                    {formatDuration(route.duration)} caminando
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export const ORS_KEY =
  'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjdhNjdjNzMyMmQ0ZTQ3MGFiMWNjMzc2MGIyYmU3YmE5IiwiaCI6Im11cm11cjY0In0='

const BASE = 'https://api.openrouteservice.org'

/** Geocodifica un texto y devuelve [lat, lng] del primer resultado */
export async function geocode(text: string): Promise<[number, number] | null> {
  const url =
    `${BASE}/geocode/search?api_key=${ORS_KEY}` +
    `&text=${encodeURIComponent(text + ', Cartagena, Colombia')}` +
    `&boundary.country=CO&size=1`

  const res = await fetch(url)
  if (!res.ok) return null

  const data = (await res.json()) as {
    features: { geometry: { coordinates: [number, number] } }[]
  }

  if (!data.features.length) return null
  const [lng, lat] = data.features[0].geometry.coordinates
  return [lat, lng]
}

export interface RouteResult {
  /** Coordenadas de la polilínea [[lat, lng], ...] */
  polyline: [number, number][]
  /** Distancia en metros */
  distance: number
  /** Duración en segundos */
  duration: number
}

/**
 * Calcula una ruta a pie entre dos puntos usando ORS Directions v2.
 * from/to son [lat, lng].
 */
export async function getRoute(
  from: [number, number],
  to: [number, number],
): Promise<RouteResult | null> {
  const url = `${BASE}/v2/directions/foot-walking`

  const body = {
    coordinates: [
      [from[1], from[0]],
      [to[1], to[0]],
    ],
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: ORS_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) return null

  const data = (await res.json()) as {
    routes: {
      summary: { distance: number; duration: number }
      geometry: { coordinates: [number, number][] }
    }[]
  }

  if (!data.routes?.length) return null

  const route = data.routes[0]
  const polyline: [number, number][] = route.geometry.coordinates.map(([lng, lat]) => [lat, lng])

  return {
    polyline,
    distance: route.summary.distance,
    duration: route.summary.duration,
  }
}

/** Formatea metros a texto legible, ej. "1.2 km" o "850 m" */
export function formatDistance(meters: number): string {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`
}

/** Formatea segundos a texto legible, ej. "12 min" */
export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60}min`
}

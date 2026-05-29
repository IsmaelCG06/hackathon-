export type Category = 'Convocatoria' | 'Mesa' | 'Empleo' | 'Formación'

export type FilterKey = 'Todas' | 'Convocatorias' | 'Mesas' | 'Empleo' | 'Formación'

export interface Opportunity {
  id: string
  title: string
  category: Category
  organization: string
  location: string
  /** Coordenadas [lat, lng] para el mapa */
  coords: [number, number]
  /** Texto de fecha/tiempo legible, ej. "Cierra el 30 de mayo" */
  date: string
  /** Descripción ampliada para el detalle */
  description?: string
  /** Texto del CTA, ej. "Postularme" */
  cta: string
  /** URL externa de postulación / más información */
  url?: string
  /** Badge de urgencia opcional, ej. "Cierra en 5 días" o "Nuevo" */
  badge?: string
  /** Marca urgencia crítica para resaltar el badge en rojo */
  urgent?: boolean
}

export interface Kpi {
  value: number
  label: string
}

export type UserType = 'youth' | 'organization'

export interface User {
  id: string
  username: string
  name: string
  organization: string
  role: string
  /** Inicial mostrada en el avatar */
  initial: string
  /** Tipo de cuenta: joven participante u organización */
  type: UserType
}

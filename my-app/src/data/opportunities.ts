import type { Kpi, Opportunity } from '../types'

export const opportunities: Opportunity[] = [
  {
    id: 'fondo-innovacion-sena',
    title: 'Fondo de Innovación Social - SENA',
    category: 'Convocatoria',
    organization: 'SENA Regional Bolívar',
    location: 'Getsemaní',
    coords: [10.4239, -75.5508],
    date: 'Cierra mañana · 30 may',
    description:
      'Convocatoria para financiar proyectos de innovación social dirigidos a jóvenes de Cartagena. Hasta $5M COP por proyecto. Incluye mentoría y acompañamiento técnico del SENA.',
    cta: 'Postularme',
    url: 'https://www.sena.edu.co/es-co/Empresarios/Paginas/convocatorias.aspx',
    badge: 'Cierra en 1 día',
    urgent: true,
  },
  {
    id: 'empleabilidad-juvenil-2025',
    title: 'Programa de empleabilidad juvenil 2025',
    category: 'Empleo',
    organization: 'Fundación Mi Sangre',
    location: 'Bocagrande',
    coords: [10.3922, -75.5285],
    date: 'Inscripciones abiertas',
    description:
      'Programa integral de empleabilidad para jóvenes entre 18 y 28 años. Incluye talleres de habilidades blandas, orientación vocacional y vinculación laboral con empresas aliadas en Cartagena.',
    cta: 'Postularme',
    url: 'https://www.fundacionmisangre.org',
    badge: 'Nuevo',
  },
  {
    id: 'mesa-participacion-juvenil',
    title: 'Mesa de participación juvenil',
    category: 'Mesa',
    organization: 'Colectivo TRASO',
    location: 'Centro Histórico',
    coords: [10.4239, -75.5475],
    date: 'Cada jueves · 4:00 PM',
    description:
      'Espacio de encuentro y deliberación para jóvenes del Centro Histórico. Se discuten propuestas de política pública local, presupuesto participativo y proyectos barriales.',
    cta: 'Cómo unirme',
    url: 'https://www.instagram.com/colectivo_traso',
  },
  {
    id: 'liderazgo-comunitario-utb',
    title: 'Escuela de Liderazgo Comunitario — módulo 3',
    category: 'Formación',
    organization: 'UTB · Liderazgo Comunitario',
    location: 'Manga',
    coords: [10.4028, -75.5369],
    date: 'Inicia el 12 de junio',
    description:
      'Módulo 3 del diplomado en Liderazgo Comunitario de la UTB. Cubre gestión de proyectos sociales, comunicación asertiva y herramientas de incidencia política. Cubre matrícula.',
    cta: 'Inscribirme',
    url: 'https://www.utb.edu.co/extension/',
    badge: 'Cierra en 5 días',
  },
  {
    id: 'hackathon-innovacion-juvenil',
    title: 'Hackathon de Innovación Juvenil',
    category: 'Convocatoria',
    organization: 'Alcaldía de Cartagena',
    location: 'El Cabrero',
    coords: [10.4331, -75.5369],
    date: '21 y 22 de junio',
    description:
      'Hackathon de 48 horas para jóvenes creadores de soluciones tecnológicas a problemas de la ciudad. Premios de hasta $10M COP y posibilidad de incubación en el Hub de Innovación Distrital.',
    cta: 'Postularme',
    url: 'https://www.cartagena.gov.co',
    badge: 'Nuevo',
  },
]

export const kpis: Kpi[] = [
  { value: 28, label: 'Organizaciones activas' },
  { value: 12, label: 'Convocatorias abiertas' },
  { value: 7, label: 'Mesas esta semana' },
  { value: 4, label: 'Empleos para ti' },
]

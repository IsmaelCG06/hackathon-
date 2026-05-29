# Conéctate Cartagena

App móvil-first que conecta a jóvenes de Cartagena con convocatorias, mesas de participación, empleo y formación. Diseño ultra moderno con paleta azul/verde, microinteracciones y enfoque en FOMO y claridad.

## Stack

- **React 19** + **TypeScript**
- **Vite** (bundler/dev server)
- **Tailwind CSS** (paleta personalizada azul/verde)
- **Lucide React** (íconos)
- **Framer Motion** (animaciones y microinteracciones)

## Scripts

```bash
npm install     # instalar dependencias
npm run dev     # servidor de desarrollo
npm run build   # type-check + build de producción
npm run lint    # eslint
npm run preview # previsualizar el build
```

## Estructura

```
src/
├── App.tsx                  # orquesta estado de filtros y búsqueda
├── types.ts                 # interfaces (Opportunity, Kpi, etc.)
├── data/opportunities.ts    # mock data (oportunidades + KPIs)
└── components/
    ├── Header.tsx           # logo + chip de ubicación
    ├── FilterPills.tsx      # barra de filtros scrolleable
    ├── SearchBar.tsx        # búsqueda + botón de filtros
    ├── UrgencyBanner.tsx    # banner de urgencia con brillo
    ├── KPISection.tsx       # KPIs con conteo animado al hacer scroll
    ├── FeedSection.tsx      # feed "Oportunidades para ti"
    ├── OpportunityCard.tsx  # tarjeta de oportunidad
    └── BottomNav.tsx        # navegación inferior
```

## Paleta (Tailwind)

| Token        | Color                  | Uso                       |
| ------------ | ---------------------- | ------------------------- |
| `bg-body`    | `#f0f7f7`              | Fondo general             |
| `primary`    | `#0ea5e9`              | CTAs, acentos, hover      |
| `primary-dark` | `#0369a1`            | Headers, títulos          |
| `secondary`  | `#10b981`              | Éxito / empleo            |
| `accent`     | `#06b6d4`              | Badges, interacciones     |
| `tag-blue`   | `#dbeafe` / `#1d4ed8`  | Convocatorias             |
| `tag-green`  | `#d1fae5` / `#047857`  | Empleo / Formación        |
| `tag-purple` | `#ede9fe` / `#6d28d9`  | Mesas                     |
| `tag-urgency`| `#fef2f2` / `#dc2626`  | Urgencias                 |
```

import { Search, SlidersHorizontal } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  onOpenFilters: () => void
}

export default function SearchBar({ value, onChange, onOpenFilters }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center gap-2 rounded-2xl bg-surface px-3.5 py-3 shadow-card ring-1 ring-slate-100 focus-within:ring-2 focus-within:ring-primary/40">
        <Search className="h-5 w-5 shrink-0 text-slate-400" strokeWidth={2.2} />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar oportunidades..."
          className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
      <button
        type="button"
        onClick={onOpenFilters}
        className="flex items-center gap-1.5 rounded-2xl bg-primary px-3.5 py-3 text-sm font-semibold text-white shadow-card transition-all hover:bg-primary-dark active:scale-95"
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={2.4} />
        <span className="hidden sm:inline">Filtros</span>
      </button>
    </div>
  )
}

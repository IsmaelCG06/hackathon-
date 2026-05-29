import { AnimatePresence, motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useState } from 'react'
import type { Category } from '../types'

const CATEGORIES: Category[] = ['Convocatoria', 'Empleo', 'Mesa', 'Formación']

const CATEGORY_COLORS: Record<Category, string> = {
  Convocatoria: 'bg-tag-blue-bg text-tag-blue-fg border-tag-blue-fg/30',
  Empleo: 'bg-tag-green-bg text-tag-green-fg border-tag-green-fg/30',
  Mesa: 'bg-tag-purple-bg text-tag-purple-fg border-tag-purple-fg/30',
  Formación: 'bg-tag-green-bg text-tag-green-fg border-tag-green-fg/30',
}

interface Props {
  open: boolean
  selected: Category[]
  onClose: () => void
  onApply: (selected: Category[]) => void
}

export default function FilterPanel({ open, selected, onClose, onApply }: Props) {
  const [local, setLocal] = useState<Category[]>(selected)

  function toggle(cat: Category) {
    setLocal((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  function handleApply() {
    onApply(local)
    onClose()
  }

  function handleReset() {
    setLocal([])
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1900] bg-primary-dark/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-[2000] mx-auto max-w-2xl rounded-t-3xl bg-surface pb-[env(safe-area-inset-bottom)] shadow-card-hover"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3">
              <span className="h-1 w-10 rounded-full bg-slate-200" />
            </div>

            <div className="px-5 pb-6 pt-4">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-primary-dark">Filtrar por categoría</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  <X className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = local.includes(cat)
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggle(cat)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : `${CATEGORY_COLORS[cat]} border`
                      }`}
                    >
                      {cat}
                      {isSelected && <Check className="h-4 w-4" strokeWidth={2.6} />}
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-[2] rounded-2xl bg-accent py-3 text-sm font-bold text-white shadow-accent-glow transition-all hover:bg-amber-600 active:scale-95"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

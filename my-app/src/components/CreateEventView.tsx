import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Loader2, Sparkles, Wand2 } from 'lucide-react'
import type { Category, Opportunity } from '../types'
import { useOpportunities } from '../data/OpportunitiesContext'
import { generarEventoDesdeIdea, mejorarDescripcion } from '../lib/gemini'

const CATEGORIES: Category[] = ['Convocatoria', 'Empleo', 'Mesa', 'Formación']

// Coordenadas aproximadas por barrio de Cartagena
const BARRIO_COORDS: Record<string, [number, number]> = {
  Getsemaní: [10.4239, -75.5508],
  'Centro Histórico': [10.4239, -75.5475],
  Bocagrande: [10.3922, -75.5285],
  Manga: [10.4028, -75.5369],
  'El Cabrero': [10.4331, -75.5369],
  Crespo: [10.4459, -75.5145],
  'La Boquilla': [10.4783, -75.5108],
}
const CARTAGENA: [number, number] = [10.3997, -75.5144]

function coordsFor(location: string): [number, number] {
  return BARRIO_COORDS[location] ?? CARTAGENA
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40) || 'evento'
  )
}

interface Props {
  organization: string
  onPublished: () => void
}

export default function CreateEventView({ organization, onPublished }: Props) {
  const { addOpportunity } = useOpportunities()

  const [idea, setIdea] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Category>('Convocatoria')
  const [location, setLocation] = useState('Centro Histórico')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [cta, setCta] = useState('Postularme')
  const [url, setUrl] = useState('')
  const [badge, setBadge] = useState('')

  const [generating, setGenerating] = useState(false)
  const [improving, setImproving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [published, setPublished] = useState(false)

  async function handleGenerate() {
    if (!idea.trim()) return
    setGenerating(true)
    setError(null)
    try {
      const ev = await generarEventoDesdeIdea(idea.trim())
      setTitle(ev.title)
      setCategory(ev.category)
      setLocation(ev.location)
      setDate(ev.date)
      setDescription(ev.description)
      setCta(ev.cta)
      setBadge(ev.badge ?? '')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo generar con IA')
    } finally {
      setGenerating(false)
    }
  }

  async function handleImprove() {
    if (!title.trim()) {
      setError('Escribe un título antes de mejorar la descripción')
      return
    }
    setImproving(true)
    setError(null)
    try {
      const mejorada = await mejorarDescripcion(title, category, description)
      setDescription(mejorada)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo mejorar la descripción')
    } finally {
      setImproving(false)
    }
  }

  function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('El título es obligatorio')
      return
    }

    const nueva: Opportunity = {
      id: `${slugify(title)}-${Date.now()}`,
      title: title.trim(),
      category,
      organization,
      location: location.trim(),
      coords: coordsFor(location.trim()),
      date: date.trim() || 'Inscripciones abiertas',
      description: description.trim() || undefined,
      cta: cta.trim() || 'Postularme',
      url: url.trim() || undefined,
      badge: badge.trim() || undefined,
    }

    addOpportunity(nueva)
    setPublished(true)
    setTimeout(onPublished, 900)
  }

  const inputClass =
    'w-full rounded-2xl bg-surface px-3.5 py-3 text-sm font-medium text-slate-700 shadow-card ring-1 ring-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40'
  const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400'

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pb-28 pt-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-primary-dark">Crear evento</h2>
        <p className="text-xs text-slate-500">Publica una oportunidad para los jóvenes de Cartagena</p>
      </div>

      {/* Bloque IA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-white shadow-card"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" strokeWidth={2.4} />
          <p className="text-sm font-bold">Asistente con IA</p>
        </div>
        <p className="text-xs text-white/70">
          Describe tu evento en una frase y la IA completará el formulario por ti.
        </p>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={2}
          placeholder="Ej: Taller gratuito de programación para jóvenes en Getsemaní en julio"
          className="w-full resize-none rounded-xl bg-white/90 px-3 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating || !idea.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-bold text-white shadow-accent-glow transition-all hover:bg-amber-600 active:scale-95 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.6} />
              Generando con IA...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" strokeWidth={2.6} />
              Generar con IA
            </>
          )}
        </button>
      </motion.div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 ring-1 ring-red-200">
          {error}
        </p>
      )}

      {/* Formulario */}
      <form onSubmit={handlePublish} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nombre del evento"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Barrio / Zona</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
            >
              {Object.keys(BARRIO_COORDS).map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Fecha / Periodicidad</label>
          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Ej: Cierra el 30 de junio"
            className={inputClass}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass + ' mb-0'}>Descripción</label>
            <button
              type="button"
              onClick={handleImprove}
              disabled={improving}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
            >
              {improving ? (
                <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2.6} />
              ) : (
                <Wand2 className="h-3 w-3" strokeWidth={2.6} />
              )}
              Mejorar con IA
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe la oportunidad..."
            className={inputClass + ' resize-none'}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Texto del botón (CTA)</label>
            <input
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              placeholder="Postularme"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Badge (opcional)</label>
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Nuevo"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>URL de postulación</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={published}
          className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-base font-bold text-white shadow-accent-glow transition-all hover:bg-amber-600 active:scale-95 disabled:opacity-70"
        >
          {published ? (
            <>
              <Check className="h-5 w-5" strokeWidth={2.6} />
              ¡Evento publicado!
            </>
          ) : (
            'Publicar evento'
          )}
        </button>
      </form>
    </main>
  )
}

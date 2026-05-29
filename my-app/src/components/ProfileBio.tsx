import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Loader2,
  Pencil,
  Plus,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react'
import type { User } from '../types'
import { mejorarBio, redactarPerfil } from '../lib/gemini'

interface ProfileData {
  headline: string
  bio: string
  skills: string[]
}

const EMPTY: ProfileData = { headline: '', bio: '', skills: [] }

function storageKey(userId: string) {
  return `cc_profile_${userId}`
}

function loadProfile(userId: string): ProfileData {
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<ProfileData>
    return {
      headline: parsed.headline ?? '',
      bio: parsed.bio ?? '',
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    }
  } catch {
    return EMPTY
  }
}

interface Props {
  user: User
}

export default function ProfileBio({ user }: Props) {
  const isOrg = user.type === 'organization'

  const [data, setData] = useState<ProfileData>(() => loadProfile(user.id))
  const [editing, setEditing] = useState(false)

  // Borrador de edición (no se persiste hasta guardar)
  const [draft, setDraft] = useState<ProfileData>(data)
  const [notas, setNotas] = useState('')
  const [skillInput, setSkillInput] = useState('')

  const [generating, setGenerating] = useState(false)
  const [improving, setImproving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fresh = loadProfile(user.id)
    setData(fresh)
    setDraft(fresh)
    setEditing(false)
  }, [user.id])

  function startEdit() {
    setDraft(data)
    setNotas('')
    setSkillInput('')
    setError(null)
    setEditing(true)
  }

  function cancelEdit() {
    setDraft(data)
    setEditing(false)
    setError(null)
  }

  function save() {
    const cleaned: ProfileData = {
      headline: draft.headline.trim(),
      bio: draft.bio.trim(),
      skills: draft.skills.map((s) => s.trim()).filter(Boolean),
    }
    setData(cleaned)
    localStorage.setItem(storageKey(user.id), JSON.stringify(cleaned))
    setEditing(false)
  }

  function addSkill() {
    const s = skillInput.trim()
    if (!s) return
    if (draft.skills.some((x) => x.toLowerCase() === s.toLowerCase())) {
      setSkillInput('')
      return
    }
    setDraft((d) => ({ ...d, skills: [...d.skills, s] }))
    setSkillInput('')
  }

  function removeSkill(skill: string) {
    setDraft((d) => ({ ...d, skills: d.skills.filter((s) => s !== skill) }))
  }

  async function handleRedactar() {
    setGenerating(true)
    setError(null)
    try {
      const perfil = await redactarPerfil({
        nombre: user.name,
        rol: user.role,
        organizacion: user.organization,
        tipo: user.type,
        notas: notas.trim(),
      })
      setDraft({
        headline: perfil.headline,
        bio: perfil.bio,
        skills: perfil.skills.length ? perfil.skills : draft.skills,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo redactar con IA')
    } finally {
      setGenerating(false)
    }
  }

  async function handleMejorar() {
    if (!draft.bio.trim()) {
      setError('Escribe algo en la biografía antes de mejorarla')
      return
    }
    setImproving(true)
    setError(null)
    try {
      const mejorada = await mejorarBio(draft.bio, user.type)
      setDraft((d) => ({ ...d, bio: mejorada }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo mejorar el texto')
    } finally {
      setImproving(false)
    }
  }

  const hasContent = data.headline || data.bio || data.skills.length > 0

  const sectionTitle = isOrg ? 'Sobre la organización' : 'Perfil profesional / CV'
  const inputClass =
    'w-full rounded-2xl bg-surface px-3.5 py-3 text-sm font-medium text-slate-700 shadow-card ring-1 ring-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/40'

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          {sectionTitle}
        </h3>
        {!editing && (
          <button
            type="button"
            onClick={startEdit}
            className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
          >
            <Pencil className="h-3.5 w-3.5" strokeWidth={2.6} />
            {hasContent ? 'Editar' : 'Crear'}
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex flex-col gap-4 rounded-3xl bg-surface p-4 shadow-card ring-1 ring-slate-100"
          >
            {/* Asistente IA */}
            <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" strokeWidth={2.4} />
                <p className="text-sm font-bold">Redacta tu {isOrg ? 'presentación' : 'CV'} con IA</p>
              </div>
              <p className="text-xs text-white/70">
                Escribe unas notas o palabras clave y la IA redactará tu {isOrg ? 'descripción' : 'perfil'} por ti.
              </p>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={2}
                placeholder={
                  isOrg
                    ? 'Ej: ONG que apoya el arte y el emprendimiento juvenil en Cartagena desde 2015'
                    : 'Ej: Estudiante de diseño, me apasiona el voluntariado y la fotografía'
                }
                className="w-full resize-none rounded-xl bg-white/90 px-3 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleRedactar}
                disabled={generating}
                className="flex items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-bold text-white shadow-accent-glow transition-all hover:bg-amber-600 active:scale-95 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.6} />
                    Redactando...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" strokeWidth={2.6} />
                    Redactar con IA
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 ring-1 ring-red-200">
                {error}
              </p>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Titular
              </label>
              <input
                value={draft.headline}
                onChange={(e) => setDraft((d) => ({ ...d, headline: e.target.value }))}
                placeholder={isOrg ? 'Ej: Transformamos vidas con cultura' : 'Ej: Diseñadora junior apasionada por el cambio social'}
                className={inputClass}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isOrg ? 'Descripción' : 'Biografía'}
                </label>
                <button
                  type="button"
                  onClick={handleMejorar}
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
                value={draft.bio}
                onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                rows={5}
                placeholder="Cuéntanos sobre ti..."
                className={inputClass + ' resize-none'}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-400">
                {isOrg ? 'Áreas de trabajo' : 'Habilidades e intereses'}
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                {draft.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
                  >
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} aria-label={`Quitar ${skill}`}>
                      <X className="h-3 w-3" strokeWidth={3} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                  placeholder="Añade una y pulsa Enter"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="grid w-12 shrink-0 place-items-center rounded-2xl bg-primary text-white transition-colors hover:bg-primary-dark active:scale-95"
                  aria-label="Añadir habilidad"
                >
                  <Plus className="h-5 w-5" strokeWidth={2.6} />
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 rounded-2xl border-2 border-slate-200 py-3 text-sm font-bold text-slate-500 transition-colors hover:bg-slate-50 active:scale-95"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={save}
                className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-accent py-3 text-sm font-bold text-white shadow-accent-glow transition-all hover:bg-amber-600 active:scale-95"
              >
                <Check className="h-5 w-5" strokeWidth={2.6} />
                Guardar
              </button>
            </div>
          </motion.div>
        ) : hasContent ? (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex flex-col gap-3 rounded-3xl bg-surface p-5 shadow-card ring-1 ring-slate-100"
          >
            {data.headline && (
              <p className="text-base font-bold leading-snug text-primary-dark">{data.headline}</p>
            )}
            {data.bio && (
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{data.bio}</p>
            )}
            {data.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {data.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-secondary/30 px-3 py-1.5 text-xs font-bold text-amber-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="empty"
            type="button"
            onClick={startEdit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2 rounded-3xl border-2 border-dashed border-slate-200 bg-surface/60 p-6 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" strokeWidth={2.2} />
            </span>
            <p className="text-sm font-bold text-slate-600">
              {isOrg ? 'Aún no tienes presentación' : 'Aún no tienes un perfil'}
            </p>
            <p className="text-xs text-slate-400">
              Crea tu {isOrg ? 'descripción' : 'CV'} y deja que la IA te ayude a redactarlo
            </p>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  )
}

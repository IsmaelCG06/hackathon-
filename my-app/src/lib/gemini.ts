import type { Category } from '../types'

const API_KEY = import.meta.env.VITE_GEMINI_APIKEY
// gemini-2.0-flash no tiene cuota gratuita (free tier limit: 0) para esta key.
// gemini-2.5-flash sí responde 200. Configurable vía VITE_GEMINI_MODEL.
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const CATEGORIES: Category[] = ['Convocatoria', 'Mesa', 'Empleo', 'Formación']

export interface EventoIA {
  title: string
  category: Category
  location: string
  date: string
  description: string
  cta: string
  badge?: string
}

async function callGemini(prompt: string, asJson: boolean): Promise<string> {
  if (!API_KEY) {
    throw new Error('Falta VITE_GEMINI_APIKEY en el archivo .env')
  }

  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: asJson
        ? { responseMimeType: 'application/json', temperature: 0.8 }
        : { temperature: 0.8 },
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Gemini respondió ${res.status}. ${detail.slice(0, 160)}`)
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini no devolvió contenido')
  return text.trim()
}

/** Autocompleta un evento a partir de una idea en lenguaje natural */
export async function generarEventoDesdeIdea(idea: string): Promise<EventoIA> {
  const prompt = `Eres asistente de "Conéctate Cartagena", una app que conecta a jóvenes de Cartagena (Colombia) con oportunidades.
Una organización describe un evento u oportunidad con esta idea:

"${idea}"

Genera los datos del evento en español dirigido a jóvenes. Responde ÚNICAMENTE con un JSON válido con esta forma exacta:
{
  "title": "título corto y atractivo (máx 60 caracteres)",
  "category": "una de: Convocatoria | Mesa | Empleo | Formación",
  "location": "un barrio o zona de Cartagena (ej: Getsemaní, Centro Histórico, Bocagrande, Manga, El Cabrero, Crespo, La Boquilla)",
  "date": "fecha o periodicidad legible (ej: 'Cierra el 30 de junio', 'Cada jueves 4:00 PM')",
  "description": "descripción motivadora de 2-3 frases, sin jerga, dirigida a jóvenes",
  "cta": "texto de acción corto (ej: Postularme, Inscribirme, Cómo unirme)",
  "badge": "opcional, ej: 'Nuevo' o 'Cierra en 5 días'"
}`

  const raw = await callGemini(prompt, true)
  const parsed = JSON.parse(raw) as Partial<EventoIA>

  const category: Category = CATEGORIES.includes(parsed.category as Category)
    ? (parsed.category as Category)
    : 'Convocatoria'

  return {
    title: parsed.title?.trim() || 'Nueva oportunidad',
    category,
    location: parsed.location?.trim() || 'Centro Histórico',
    date: parsed.date?.trim() || 'Inscripciones abiertas',
    description: parsed.description?.trim() || '',
    cta: parsed.cta?.trim() || 'Postularme',
    badge: parsed.badge?.trim() || undefined,
  }
}

export interface PerfilIA {
  headline: string
  bio: string
  skills: string[]
}

/** Redacta un perfil/CV (titular, biografía y habilidades) a partir de unas notas */
export async function redactarPerfil(input: {
  nombre: string
  rol: string
  organizacion: string
  tipo: 'youth' | 'organization'
  notas: string
}): Promise<PerfilIA> {
  const esOrg = input.tipo === 'organization'
  const prompt = `Eres un redactor profesional para "Conéctate Cartagena", una app que conecta a jóvenes de Cartagena (Colombia) con oportunidades.
Redacta ${esOrg ? 'la presentación de una organización' : 'el perfil/CV de una persona joven'} en español, en primera persona${esOrg ? ' plural (nosotros)' : ''}, con tono cercano, profesional y motivador.

Datos:
- Nombre: ${input.nombre}
- ${esOrg ? 'Organización' : 'Rol'}: ${esOrg ? input.organizacion : input.rol}
- Notas que aporta: "${input.notas || '(sin notas: invéntalo de forma realista y genérica a partir del nombre y rol)'}"

Responde ÚNICAMENTE con un JSON válido con esta forma exacta:
{
  "headline": "frase de presentación corta y potente (máx 80 caracteres)",
  "bio": "${esOrg ? 'descripción de la organización' : 'biografía profesional'} de 3-4 frases, sin jerga",
  "skills": ["4 a 6 ${esOrg ? 'áreas de trabajo o servicios' : 'habilidades o intereses'} cortos"]
}`

  const raw = await callGemini(prompt, true)
  const parsed = JSON.parse(raw) as Partial<PerfilIA>

  return {
    headline: parsed.headline?.trim() || '',
    bio: parsed.bio?.trim() || '',
    skills: Array.isArray(parsed.skills)
      ? parsed.skills.map((s) => String(s).trim()).filter(Boolean).slice(0, 6)
      : [],
  }
}

/** Mejora/reescribe un texto de biografía/perfil para que sea más profesional y claro */
export async function mejorarBio(textoActual: string, tipo: 'youth' | 'organization'): Promise<string> {
  const esOrg = tipo === 'organization'
  const prompt = `Reescribe el siguiente texto de ${esOrg ? 'presentación de una organización' : 'biografía profesional de una persona'} para que sea claro, profesional y motivador, sin jerga. Máximo 4 frases, en español. Responde solo con el texto, sin comillas ni encabezados.

Texto actual: ${textoActual || '(vacío)'}`

  return callGemini(prompt, false)
}

/** Mejora/reescribe una descripción para que sea más atractiva para jóvenes */
export async function mejorarDescripcion(
  titulo: string,
  categoria: Category,
  textoActual: string,
): Promise<string> {
  const prompt = `Reescribe la siguiente descripción de una oportunidad para jóvenes de Cartagena para que sea clara, motivadora y sin jerga. Máximo 3 frases. Responde solo con el texto, sin comillas ni encabezados.

Título: ${titulo}
Categoría: ${categoria}
Descripción actual: ${textoActual || '(vacía, créala desde el título)'}`

  return callGemini(prompt, false)
}

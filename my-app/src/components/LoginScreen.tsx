import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, User as UserIcon } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export default function LoginScreen() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(username, password)
    if (!ok) setError(true)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b from-primary-dark to-primary px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <motion.img
            src="/logo.png"
            alt="Conéctate Cartagena"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
            className="mb-4 h-24 w-24 rounded-3xl bg-white/10 p-2 ring-1 ring-white/20 backdrop-blur"
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Conéctate Cartagena
          </h1>
          <p className="mt-1 text-sm font-medium text-white/60">
            Tu ciudad, tus oportunidades
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-3xl bg-white/10 p-6 ring-1 ring-white/15 backdrop-blur"
        >
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
              Usuario
            </label>
            <div className="flex items-center gap-2 rounded-2xl bg-white/90 px-3.5 py-3 ring-2 ring-transparent focus-within:ring-accent">
              <UserIcon className="h-5 w-5 shrink-0 text-slate-400" strokeWidth={2.2} />
              <input
                type="text"
                value={username}
                autoCapitalize="none"
                autoCorrect="off"
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError(false)
                }}
                placeholder="usuario1"
                className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/60">
              Contraseña
            </label>
            <div className="flex items-center gap-2 rounded-2xl bg-white/90 px-3.5 py-3 ring-2 ring-transparent focus-within:ring-accent">
              <Lock className="h-5 w-5 shrink-0 text-slate-400" strokeWidth={2.2} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-red-500/20 px-3 py-2 text-center text-xs font-semibold text-red-100 ring-1 ring-red-400/30"
            >
              Usuario o contraseña incorrectos
            </motion.p>
          )}

          <button
            type="submit"
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-accent py-3.5 text-base font-bold text-white shadow-accent-glow transition-all hover:bg-amber-600 active:scale-95"
          >
            Ingresar
            <ArrowRight className="h-5 w-5" strokeWidth={2.6} />
          </button>
        </form>

        {/* Ayuda demo */}
        <p className="mt-5 text-center text-xs text-white/50">
          Acceso de prueba: <span className="font-bold text-white/80">usuario1</span> /{' '}
          <span className="font-bold text-white/80">password1</span>
        </p>
      </motion.div>
    </div>
  )
}

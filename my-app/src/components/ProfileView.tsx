import { motion } from 'framer-motion'
import { Building2, IdCard, LogOut, Mail, ShieldCheck } from 'lucide-react'
import type { User } from '../types'
import ProfileBio from './ProfileBio'

interface Props {
  user: User
  onLogout: () => void
}

export default function ProfileView({ user, onLogout }: Props) {
  const fields = [
    { icon: IdCard, label: 'Nombre', value: user.name },
    { icon: Mail, label: 'Usuario', value: user.username },
    { icon: Building2, label: 'Organización', value: user.organization },
    { icon: ShieldCheck, label: 'Rol', value: user.role },
  ]

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-5 px-4 pb-28 pt-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center gap-3 rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-card"
      >
        <span className="grid h-20 w-20 place-items-center rounded-full bg-accent text-3xl font-extrabold text-primary-dark ring-4 ring-white/15">
          {user.initial}
        </span>
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
          <p className="text-sm font-medium text-white/70">{user.role}</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          EN LÍNEA
        </span>
      </motion.div>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Datos de la cuenta
        </h3>
        {fields.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-card ring-1 ring-slate-100"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {label}
              </p>
              <p className="truncate text-sm font-semibold text-slate-700">{value}</p>
            </div>
          </motion.div>
        ))}
      </section>

      <ProfileBio user={user} />

      <button
        type="button"
        onClick={onLogout}
        className="flex items-center justify-center gap-2 rounded-2xl border-2 border-red-200 bg-red-50 py-3.5 text-sm font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95"
      >
        <LogOut className="h-5 w-5" strokeWidth={2.4} />
        Cerrar sesión
      </button>
    </main>
  )
}

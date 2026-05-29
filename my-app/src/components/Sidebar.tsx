import { AnimatePresence, motion } from 'framer-motion'
import { Bell, Home, LogOut, MapPin, PlusCircle, User as UserIcon, Users, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { User } from '../types'

const BASE_ITEMS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Inicio', icon: Home },
  { id: 'map', label: 'Mapa', icon: MapPin },
  { id: 'community', label: 'Comunidad', icon: Users },
  { id: 'alerts', label: 'Alertas', icon: Bell },
  { id: 'profile', label: 'Mi perfil', icon: UserIcon },
]

const CREATE_ITEM = { id: 'create', label: 'Crear evento', icon: PlusCircle }

interface Props {
  open: boolean
  user: User
  activeTab: string
  alertCount?: number
  canCreate?: boolean
  onClose: () => void
  onChangeTab: (id: string) => void
  onLogout: () => void
}

export default function Sidebar({
  open,
  user,
  activeTab,
  alertCount = 0,
  canCreate = false,
  onClose,
  onChangeTab,
  onLogout,
}: Props) {
  const navItems = canCreate ? [...BASE_ITEMS, CREATE_ITEM] : BASE_ITEMS

  function handleNav(id: string) {
    onChangeTab(id)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1900] bg-black/50 backdrop-blur-sm"
          />

          <motion.aside
            key="panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 left-0 z-[2000] flex w-[82%] max-w-xs flex-col bg-primary-dark pt-[env(safe-area-inset-top)] text-white shadow-2xl"
          >
            {/* Logo + cerrar */}
            <div className="flex items-center justify-between px-5 pb-2 pt-5">
              <div className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="Conéctate Cartagena"
                  className="h-11 w-11 rounded-2xl bg-white/10 p-1 ring-1 ring-white/15"
                />
                <div className="leading-tight">
                  <p className="text-sm font-extrabold uppercase tracking-tight">Conéctate</p>
                  <p className="text-sm font-extrabold uppercase tracking-tight text-accent">
                    Cartagena
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
              >
                <X className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>

            {/* Tarjeta de usuario */}
            <div className="px-5 pt-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-lg font-extrabold text-primary-dark">
                  {user.initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-bold">{user.name}</p>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    EN LÍNEA
                  </p>
                </div>
              </div>
            </div>

            {/* Navegación */}
            <nav className="flex-1 overflow-y-auto px-3 pt-6">
              <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                Navegación
              </p>
              <div className="flex flex-col gap-1">
                {navItems.map(({ id, label, icon: Icon }) => {
                  const isActive = id === activeTab
                  const showBadge = id === 'alerts' && alertCount > 0
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleNav(id)}
                      className={`relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                        isActive
                          ? 'bg-accent text-primary-dark'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" strokeWidth={2.4} />
                      {label}
                      {showBadge && (
                        <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                          {alertCount}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </nav>

            {/* Logout */}
            <div className="border-t border-white/10 px-3 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
              <button
                type="button"
                onClick={() => {
                  onLogout()
                  onClose()
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold text-red-300 transition-colors hover:bg-red-500/15 hover:text-red-200"
              >
                <LogOut className="h-5 w-5" strokeWidth={2.4} />
                Cerrar sesión
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

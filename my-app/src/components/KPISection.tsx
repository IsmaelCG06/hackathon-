import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import type { Kpi } from '../types'

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    if (!inView) return
    const controls = animate(count, to, { duration: 1.1, ease: 'easeOut' })
    return controls.stop
  }, [inView, to, count])

  return <motion.span ref={ref}>{rounded}</motion.span>
}

export default function KPISection({ kpis }: { kpis: Kpi[] }) {
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          className="rounded-2xl bg-surface p-4 shadow-card ring-1 ring-slate-100"
        >
          <p className="bg-gradient-to-br from-primary to-accent bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            <Counter to={kpi.value} />
          </p>
          <p className="mt-1 text-xs font-medium leading-tight text-slate-500">
            {kpi.label}
          </p>
        </motion.div>
      ))}
    </section>
  )
}

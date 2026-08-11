"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

interface IntroLoaderProps {
  /** Fires once the loader has fully slid away and the page is interactive. */
  onComplete?: () => void
}

const DURATION_MS = 1300
const REDUCED_MOTION_DURATION_MS = 150

/**
 * Full-screen intro loader. Locks body scroll while active, animates a
 * 000 -> 100 progress readout, then fades/slides away and hands control
 * back to the page via onComplete. Under prefers-reduced-motion it resolves
 * almost immediately rather than forcing anyone to sit through the count.
 */
export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const prefersReducedMotion = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const startedExitRef = useRef(false)

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  useEffect(() => {
    const duration = prefersReducedMotion ? REDUCED_MOTION_DURATION_MS : DURATION_MS
    let start: number | null = null
    let raf: number

    const step = (timestamp: number) => {
      if (start === null) start = timestamp
      const elapsed = timestamp - start
      const pct = Math.min(100, Math.round((elapsed / duration) * 100))
      setProgress(pct)

      if (elapsed < duration) {
        raf = requestAnimationFrame(step)
      } else if (!startedExitRef.current) {
        startedExitRef.current = true
        setVisible(false)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [prefersReducedMotion])

  const handleExitComplete = () => {
    document.body.style.overflow = ""
    onComplete?.()
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <motion.div
          key="intro-loader"
          initial={false}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { y: "-100%", transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }
          }
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#09090B]"
          aria-hidden={!visible}
        >
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.4 }}
            className="flex flex-col items-center px-6 text-center"
          >
            <p className="font-sans text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Quick<span className="text-primary">Hands</span>
            </p>
            <p className="mt-3 font-sans text-xs font-medium uppercase tracking-[0.18em] text-white/50">
              Get tasks done. Find trusted local help.
            </p>

            <div className="mt-10 flex w-48 flex-col items-center gap-2.5 sm:w-56">
              <div className="h-px w-full overflow-hidden bg-white/15">
                <div
                  className="h-full bg-primary"
                  style={{
                    width: `${progress}%`,
                    transition: prefersReducedMotion ? "none" : "width 60ms linear",
                  }}
                />
              </div>
              <span className="font-mono text-[11px] tabular-nums tracking-widest text-white/40">
                {String(progress).padStart(3, "0")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LiquidRevealProps {
  /** Image always visible underneath. */
  baseSrc: string
  /** Image revealed by the cursor's soft brush trail. */
  revealSrc: string
  baseAlt: string
  revealAlt: string
  className?: string
}

interface TrailPoint {
  x: number
  y: number
  bornAt: number
}

const MAX_DPR = 2
const TRAIL_LIFETIME_MS = 650
const BRUSH_RADIUS_RATIO = 0.16 // relative to the shorter canvas edge

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/**
 * Base image sits underneath at all times. Moving the pointer over the canvas
 * paints a soft, decaying brush trail that reveals a second image beneath the
 * cursor. Disabled entirely (no canvas mounted) for touch devices and when
 * prefers-reduced-motion is set — those cases render a static base image.
 */
export function LiquidReveal({ baseSrc, revealSrc, baseAlt, revealAlt, className }: LiquidRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trailRef = useRef<TrailPoint[]>([])
  const rafRef = useRef<number | null>(null)
  const imagesRef = useRef<{ base: HTMLImageElement; reveal: HTMLImageElement } | null>(null)
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })
  const idleRef = useRef(true)

  const prefersReducedMotion = useReducedMotion()
  const [interactive, setInteractive] = useState(false)

  // Decide, client-side only, whether this device gets the canvas effect.
  useEffect(() => {
    if (prefersReducedMotion) return
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches
    if (isCoarsePointer) return
    setInteractive(true)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (!interactive) return
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let cancelled = false
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const maskCanvas = document.createElement("canvas")
    const maskCtx = maskCanvas.getContext("2d")
    const revealCanvas = document.createElement("canvas")
    const revealCtx = revealCanvas.getContext("2d")
    if (!maskCtx || !revealCtx) return

    const draw = () => {
      const { width, height, dpr } = sizeRef.current
      const imgs = imagesRef.current
      if (!imgs || width === 0 || height === 0) return

      // Base layer.
      ctx.clearRect(0, 0, width * dpr, height * dpr)
      drawCover(ctx, imgs.base, width * dpr, height * dpr)

      const trail = trailRef.current
      if (trail.length === 0) return

      // Build the soft mask from the current trail.
      maskCtx.clearRect(0, 0, width * dpr, height * dpr)
      const now = performance.now()
      const radius = Math.min(width, height) * dpr * BRUSH_RADIUS_RATIO

      for (const point of trail) {
        const age = now - point.bornAt
        const life = 1 - age / TRAIL_LIFETIME_MS
        if (life <= 0) continue
        const px = point.x * dpr
        const py = point.y * dpr
        const gradient = maskCtx.createRadialGradient(px, py, 0, px, py, radius)
        gradient.addColorStop(0, `rgba(255,255,255,${0.85 * life})`)
        gradient.addColorStop(1, "rgba(255,255,255,0)")
        maskCtx.fillStyle = gradient
        maskCtx.beginPath()
        maskCtx.arc(px, py, radius, 0, Math.PI * 2)
        maskCtx.fill()
      }

      // Reveal layer, clipped to the mask.
      revealCtx.clearRect(0, 0, width * dpr, height * dpr)
      drawCover(revealCtx, imgs.reveal, width * dpr, height * dpr)
      revealCtx.globalCompositeOperation = "destination-in"
      revealCtx.drawImage(maskCanvas, 0, 0)
      revealCtx.globalCompositeOperation = "source-over"

      ctx.drawImage(revealCanvas, 0, 0)
    }

    const tick = () => {
      if (cancelled) return
      const now = performance.now()
      trailRef.current = trailRef.current.filter((p) => now - p.bornAt < TRAIL_LIFETIME_MS)
      draw()

      if (trailRef.current.length > 0) {
        idleRef.current = false
        rafRef.current = requestAnimationFrame(tick)
      } else {
        idleRef.current = true
        rafRef.current = null
      }
    }

    const ensureLoop = () => {
      if (idleRef.current && rafRef.current === null) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))

      sizeRef.current = { width, height, dpr }

      for (const c of [canvas, maskCanvas, revealCanvas]) {
        c.width = width * dpr
        c.height = height * dpr
        c.style.width = `${width}px`
        c.style.height = `${height}px`
      }
      draw()
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      trailRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        bornAt: performance.now(),
      })
      // Cap trail length so long idle-hover sessions don't grow unbounded.
      if (trailRef.current.length > 120) {
        trailRef.current = trailRef.current.slice(-120)
      }
      ensureLoop()
    }

    const resizeObserver = new ResizeObserver(() => resize())
    resizeObserver.observe(container)

    Promise.all([loadImage(baseSrc), loadImage(revealSrc)])
      .then(([base, reveal]) => {
        if (cancelled) return
        imagesRef.current = { base, reveal }
        resize()
      })
      .catch(() => {
        // If images fail to load, leave the canvas blank; the <img> fallback
        // markup below still communicates intent via alt text on the section.
      })

    canvas.addEventListener("pointermove", handlePointerMove)

    return () => {
      cancelled = true
      resizeObserver.disconnect()
      canvas.removeEventListener("pointermove", handlePointerMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [interactive, baseSrc, revealSrc])

  if (!interactive) {
    return (
      <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={baseSrc}
          alt={baseAlt}
          className="h-full w-full object-cover"
          loading="eager"
        />
        <span className="sr-only">{revealAlt}</span>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      <canvas ref={canvasRef} className="h-full w-full" role="img" aria-label={`${baseAlt} ${revealAlt}`} />
    </div>
  )
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
) {
  const imgRatio = img.width / img.height
  const targetRatio = targetWidth / targetHeight

  let drawWidth = targetWidth
  let drawHeight = targetHeight
  let offsetX = 0
  let offsetY = 0

  if (imgRatio > targetRatio) {
    drawHeight = targetHeight
    drawWidth = drawHeight * imgRatio
    offsetX = (targetWidth - drawWidth) / 2
  } else {
    drawWidth = targetWidth
    drawHeight = drawWidth / imgRatio
    offsetY = (targetHeight - drawHeight) / 2
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
}

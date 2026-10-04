"use client"

import { useEffect, useRef } from "react"

const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21].map(
  (value) => (value + 0.5) / 64
)

const PALETTE = ["#F3F1C4", "#C9EC9A", "#7DD35A", "#2FA51C", "#108600", "#0A5A12", "#062E0B"]

const W = 300
const H = 250

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Animated ordered-dither arc drawn into the returned canvas ref. Still frame under reduced motion. */
export function useDitherArc(palette: readonly string[] = PALETTE) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const image = ctx.createImageData(W, H)
    const data = image.data
    const rgbPalette = palette.map(hexToRgb)
    const colors = rgbPalette.length
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const cx = W * 1.14
    const cy = -H * 0.2

    const draw = (t: number) => {
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = (y * W + x) * 4
          const dx = x - cx
          const dy = y - cy
          const r = Math.sqrt(dx * dx + dy * dy)
          const ang = Math.atan2(dy, dx)
          const R = H * 0.78 + 9 * Math.sin(ang * 3 + t * 0.55) + 5 * Math.sin(ang * 7 - t * 0.8)
          const wd = H * (0.34 + 0.06 * Math.sin(ang * 2 - t * 0.4))
          const e = 1 - Math.abs((r - R) / wd)
          const a = (ang - 1.45) / 1.55
          const mask = smoothstep(0, 0.28, a) * smoothstep(1.05, 0.55, a) * smoothstep(0.3, 0.68, x / W)
          const density = smoothstep(-0.45, 0.3, e) * mask
          const threshold = BAYER[(y & 7) * 8 + (x & 7)]
          if (density <= BAYER[((y + 3) & 7) * 8 + ((x + 5) & 7)]) {
            data[i + 3] = 0
            continue
          }
          const p = Math.max(0, e) * (colors - 1) * (0.92 + 0.08 * Math.sin(t * 0.7 + ang * 4))
          const k = Math.min(colors - 1, Math.floor(p + threshold))
          const [red, green, blue] = rgbPalette[k]
          data[i] = red
          data[i + 1] = green
          data[i + 2] = blue
          data[i + 3] = 255
        }
      }
      ctx.putImageData(image, 0, 0)
    }

    if (reduceMotion) {
      draw(2)
      return
    }

    const start = performance.now()
    let last = 0
    let frame = 0
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      if (document.hidden || now - last < 42) return
      last = now
      draw((now - start) / 1000)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [palette])

  return canvasRef
}

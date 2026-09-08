import { useEffect, useRef } from 'react'
import { makeStars } from '../data/sky.js'

// The sky is painted once into a canvas rather than kept as ~600 SVG elements.
// As DOM nodes each star was a paint target for the whole page, and the ones
// that twinkled forced a repaint of a full-viewport layer every frame, which
// also made the blurred panel above them re-composite continuously.
export default function Starfield() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const stars = makeStars(w, h)

      // Soft bloom on the brightest stars, for depth.
      ctx.fillStyle = '#8ea2d8'
      ctx.globalAlpha = 0.12
      for (const s of stars) {
        if (s.r <= 1.15) continue
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.fillStyle = '#dbe4fb'
      for (const s of stars) {
        ctx.globalAlpha = s.o
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    draw()

    // Redraw only once the resize settles, not on every intermediate frame.
    let t = 0
    const onResize = () => { clearTimeout(t); t = setTimeout(draw, 150) }
    window.addEventListener('resize', onResize)
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={ref} className="starfield" aria-hidden="true" />
}

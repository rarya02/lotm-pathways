// Shared starfield generation.

// Deterministic PRNG: the sky is identical on every draw instead of reshuffling.
const seededRandom = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647

// One star per ~3000px², the density the graph canvas was originally tuned at.
const DENSITY = 3000

export function makeStars(width, height, { seed = 42, max = 900 } = {}) {
  const rng = seededRandom(seed)
  const count = Math.min(max, Math.round((width * height) / DENSITY))
  return Array.from({ length: count }, () => {
    // Skewed so most stars are faint specks and only a few are bright.
    const r = Math.pow(rng(), 2.2) * 1.5 + 0.25
    return { x: rng() * width, y: rng() * height, r, o: 0.18 + r * 0.42 }
  })
}

import { PATHWAYS } from './pathways.js'

// Vite turns these into hashed asset URLs at build time.
const files = import.meta.glob('../assets/symbols/*.webp', {
  eager: true, query: '?url', import: 'default',
})

const byName = {}
for (const [path, url] of Object.entries(files)) byName[path.split('/').pop()] = url

// Filenames follow the pathway name: "Wheel of Fortune" -> Wheel_of_Fortune_Symbol2.webp
export const SYMBOLS = Object.fromEntries(
  PATHWAYS
    .map(p => [p.id, byName[`${p.name.replace(/ /g, '_')}_Symbol2.webp`]])
    .filter(([, url]) => url)
)

export const symbolFor = (id) => SYMBOLS[id] ?? null

// Pathways whose symbol failed to resolve, so a rename shows up loudly in dev.
export const MISSING_SYMBOLS = PATHWAYS.filter(p => !SYMBOLS[p.id]).map(p => p.id)

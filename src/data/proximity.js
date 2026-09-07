import { GROUPS, GROUP_EDGES, HIDDEN_NEIGHBOURING } from './groups.js'
import { PATHWAYS, getPathway } from './pathways.js'

// Ordered from closest to furthest. Cost is "accumulated madness" when switching.
export const PROXIMITY = {
  same:          { rank: 0, cost: 0,        label: 'Same pathway' },
  neighbouring:  { rank: 1, cost: 0,        label: 'Neighbouring' },
  compatible:    { rank: 2, cost: 2,        label: 'Compatible' },
  hidden:        { rank: 3, cost: 8,        label: 'Hidden neighbouring' },
  unknown:       { rank: 4, cost: Infinity, label: 'No information' },
  nonAdjacent:   { rank: 5, cost: Infinity, label: 'Non-adjacent' },
}

const key = (a, b) => [a, b].sort().join('|')

function buildProximityMap() {
  const map = new Map()
  const set = (a, b, kind, note) => {
    const k = key(a, b)
    const existing = map.get(k)
    // Keep the closest relationship if something is declared twice
    if (existing && PROXIMITY[existing.kind].rank <= PROXIMITY[kind].rank) return
    map.set(k, { kind, note })
  }

  // 1. Pathways in the same group are neighbouring with each other
  for (const g of GROUPS) {
    const ps = PATHWAYS.filter(p => p.group === g.id).map(p => p.id)
    for (let i = 0; i < ps.length; i++)
      for (let j = i + 1; j < ps.length; j++)
        set(ps[i], ps[j], 'neighbouring', `both under ${g.name}`)
  }

  // 2. Expand group-level edges down to pathway pairs
  for (const e of GROUP_EDGES) {
    const aPaths = PATHWAYS.filter(p => p.group === e.a).map(p => p.id)
    const bPaths = PATHWAYS.filter(p => p.group === e.b).map(p => p.id)

        if (e.kind === 'neighbouring' || e.kind === 'compatible' || e.kind === 'nonAdjacent') {
      for (const a of aPaths)
        for (const b of bPaths)
          set(a, b, e.kind, e.note)
    }

    if (e.kind === 'partial') {
      // Only the listed pathways of the pillar group participate
      const listed = new Set(e.pathways)
      const aSel = aPaths.filter(p => listed.has(p))
      const bSel = bPaths.filter(p => listed.has(p))
      // The listed side is whichever group actually contains them
      const from = aSel.length ? aSel : aPaths
      const to   = bSel.length ? bSel : bPaths
      for (const a of from)
        for (const b of to)
          set(a, b, 'compatible', e.note)
    }
  }

  // 3. Hidden neighbouring: overlap without switchability
  for (const h of HIDDEN_NEIGHBOURING) set(h.a, h.b, 'hidden', h.note)

  return map
}

const PROXIMITY_MAP = buildProximityMap()

export function proximityBetween(aId, bId) {
  if (aId === bId) return { kind: 'same', note: null }
  return PROXIMITY_MAP.get(key(aId, bId)) ?? { kind: 'unknown', note: null }
}

// Can you switch from pathway a to pathway b at all?
export function canSwitch(aId, bId) {
  const { kind } = proximityBetween(aId, bId)
  return kind === 'neighbouring' || kind === 'compatible'
}

// Every pathway you could switch to from here, closest first.
export function switchTargets(aId) {
  return PATHWAYS
    .filter(p => p.id !== aId && canSwitch(aId, p.id))
    .map(p => ({ ...p, ...proximityBetween(aId, p.id) }))
    .sort((x, y) => PROXIMITY[x.kind].rank - PROXIMITY[y.kind].rank)
}

// Flat edge list, for D3.
export function proximityEdges() {
  return [...PROXIMITY_MAP.entries()].map(([k, v]) => {
    const [source, target] = k.split('|')
    return { source, target, ...v }
  })
}

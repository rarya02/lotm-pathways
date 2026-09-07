import { PATHWAYS, getPathway } from './pathways.js'
import { proximityBetween, PROXIMITY } from './proximity.js'

// Switching is only viable from Sequence 4 upward (lower is possible but very risky)
export const SWITCH_MIN_SEQUENCE = 4

const nodeId = (pathway, seq) => `${pathway}@${seq}`

// Every legal move out of (pathway, seq). Advancing goes 9 -> 0.
function neighbours(pathway, seq) {
  const out = []
  if (seq === 0) return out
  const next = seq - 1

  // 1. Advance within the same pathway
  out.push({ pathway, seq: next, cost: 0, kind: 'advance' })

  // 2. Switch to another pathway at the next sequence
  if (next <= SWITCH_MIN_SEQUENCE) {
    for (const p of PATHWAYS) {
      if (p.id === pathway) continue
      const { kind } = proximityBetween(pathway, p.id)
      const cost = PROXIMITY[kind].cost
      if (!isFinite(cost)) continue
      out.push({ pathway: p.id, seq: next, cost, kind: 'switch', proximity: kind })
    }
  }
  return out
}

// Dijkstra over (pathway, sequence) minimising accumulated madness.
export function findPath(startPathway, startSeq, targetPathway, targetSeq = 0) {
  const dist = new Map()
  const prev = new Map()
  const start = nodeId(startPathway, startSeq)
  dist.set(start, 0)

  // Small graph (320 nodes), so a linear scan beats a heap in complexity of code
  const visited = new Set()
  const queue = new Set([start])

  while (queue.size) {
    let current = null
    let best = Infinity
    for (const n of queue) {
      const d = dist.get(n) ?? Infinity
      if (d < best) { best = d; current = n }
    }
    if (current === null) break
    queue.delete(current)
    visited.add(current)

    const [cp, cs] = current.split('@')
    const cSeq = Number(cs)
    if (cp === targetPathway && cSeq === targetSeq) break

    for (const nb of neighbours(cp, cSeq)) {
      const id = nodeId(nb.pathway, nb.seq)
      if (visited.has(id)) continue
      const alt = best + nb.cost
      if (alt < (dist.get(id) ?? Infinity)) {
        dist.set(id, alt)
        prev.set(id, { from: current, move: nb })
        queue.add(id)
      }
    }
  }

  const goal = nodeId(targetPathway, targetSeq)
  if (!dist.has(goal)) return null

  // Walk backwards to rebuild the route
  const steps = []
  let cur = goal
  while (cur !== start) {
    const p = prev.get(cur)
    if (!p) return null
    const [pathway, seq] = cur.split('@')
    steps.unshift({
      pathway,
      seq: Number(seq),
      name: getPathway(pathway).seq[9 - Number(seq)],
      ...p.move,
    })
    cur = p.from
  }

  return { totalMadness: dist.get(goal), steps }
}

// Readable one-line summary of a route
export function describePath(result) {
  if (!result) return 'No viable route.'
  const parts = result.steps.map(s => {
    const p = getPathway(s.pathway)
    return `${p.name} S${s.seq} (${s.name})${s.kind === 'switch' ? ' [switch]' : ''}`
  })
  return `${parts.join(' -> ')}   |   madness: ${result.totalMadness}`
}
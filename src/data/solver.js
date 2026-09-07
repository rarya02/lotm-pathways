import { PATHWAYS, getPathway } from './pathways.js'
import { GROUPS } from './groups.js'
import { proximityBetween, PROXIMITY } from './proximity.js'

export const SWITCH_MIN_SEQUENCE = 4

const groupOf = (pathwayId) => getPathway(pathwayId).group
const groupName = (id) => GROUPS.find(g => g.id === id)?.name ?? id

// State key includes which groups have been entered, since that determines
// whether the Sefirah will still accept you at the end.
const nodeId = (pathway, seq, groups) =>
  `${pathway}@${seq}#${[...groups].sort().join(',')}`

function neighbours(pathway, seq, groups) {
  const out = []
  if (seq === 0) return out
  const next = seq - 1

  out.push({ pathway, seq: next, cost: 0, kind: 'advance', groups })

  if (next <= SWITCH_MIN_SEQUENCE) {
    for (const p of PATHWAYS) {
      if (p.id === pathway) continue
      const { kind } = proximityBetween(pathway, p.id)
      const cost = PROXIMITY[kind].cost
      if (!isFinite(cost)) continue
      const nextGroups = new Set(groups)
      nextGroups.add(p.group)
      out.push({
        pathway: p.id, seq: next, cost, kind: 'switch',
        proximity: kind, groups: nextGroups,
      })
    }
  }
  return out
}

/**
 * @param opts.requireClean  if true, only routes ending in a state where the
 *   target's group is the only one touched are accepted (Sefirah-safe).
 */
export function findPath(startPathway, startSeq, targetPathway, targetSeq = 0, opts = {}) {
  const { requireClean = false } = opts

  const startGroups = new Set([groupOf(startPathway)])
  const start = nodeId(startPathway, startSeq, startGroups)

  const dist = new Map([[start, 0]])
  const state = new Map([[start, { pathway: startPathway, seq: startSeq, groups: startGroups }]])
  const prev = new Map()
  const visited = new Set()
  const queue = new Set([start])

  const isGoal = (s) => {
    if (s.pathway !== targetPathway || s.seq !== targetSeq) return false
    if (!requireClean) return true
    return s.groups.size === 1 && s.groups.has(groupOf(targetPathway))
  }

  let goal = null
  while (queue.size) {
    let current = null, best = Infinity
    for (const n of queue) {
      const d = dist.get(n) ?? Infinity
      if (d < best) { best = d; current = n }
    }
    if (current === null) break
    queue.delete(current)
    visited.add(current)

    const s = state.get(current)
    if (isGoal(s)) { goal = current; break }

    for (const nb of neighbours(s.pathway, s.seq, s.groups)) {
      const id = nodeId(nb.pathway, nb.seq, nb.groups)
      if (visited.has(id)) continue
      const alt = best + nb.cost
      if (alt < (dist.get(id) ?? Infinity)) {
        dist.set(id, alt)
        state.set(id, { pathway: nb.pathway, seq: nb.seq, groups: nb.groups })
        prev.set(id, { from: current, move: nb })
        queue.add(id)
      }
    }
  }

  if (!goal) return null

  const steps = []
  let cur = goal
  while (cur !== start) {
    const p = prev.get(cur)
    if (!p) return null
    const s = state.get(cur)
    steps.unshift({
      pathway: s.pathway,
      seq: s.seq,
      name: getPathway(s.pathway).seq[9 - s.seq],
      kind: p.move.kind,
      proximity: p.move.proximity,
      cost: p.move.cost,
    })
    cur = p.from
  }

  const finalGroups = state.get(goal).groups
  const clean = finalGroups.size === 1 && finalGroups.has(groupOf(targetPathway))

  return {
    totalMadness: dist.get(goal),
    steps,
    groupsTouched: [...finalGroups],
    sefirahSafe: clean,
    warning: clean ? null
      : `Characteristics from ${finalGroups.size} groups (${[...finalGroups].map(groupName).join(', ')}). Must be expelled before accommodating a Sefirah.`,
  }
}

export function describePath(result) {
  if (!result) return 'No viable route.'
  const parts = result.steps.map(s => {
    const p = getPathway(s.pathway)
    return `${p.name} S${s.seq} (${s.name})${s.kind === 'switch' ? ` [switch: ${s.proximity}]` : ''}`
  })
  let out = `${parts.join(' -> ')}\n  madness: ${result.totalMadness}`
  if (result.warning) out += `\n  WARNING: ${result.warning}`
  return out
}
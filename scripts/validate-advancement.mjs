// Checks the advancement data against the pathway list: sequence coverage,
// names matching by index, required keys, and no stray keys at either level.
// Run: node scripts/validate-advancement.mjs
import { ADVANCEMENT } from '../src/data/advancement.js'
import { PATHWAYS } from '../src/data/pathways.js'
import { GROUPS } from '../src/data/groups.js'

const SEQ_KEYS = ['name', 'main', 'supp', 'ritual']
const isNum = k => /^\d+$/.test(k)
const problems = []

for (const [id, entry] of Object.entries(ADVANCEMENT)) {
  const p = PATHWAYS.find(x => x.id === id)
  if (!p) { problems.push(`${id}: no such pathway`); continue }

  const seqs = Object.keys(entry).filter(isNum).map(Number).sort((a, b) => b - a)
  if (seqs.join() !== '9,8,7,6,5,4,3,2,1,0') problems.push(`${id}: sequence keys are ${seqs.join()}`)
  for (const k of Object.keys(entry).filter(k => !isNum(k))) {
    problems.push(`${id}: unknown pathway-level key '${k}'`)
  }

  for (const n of seqs) {
    const e = entry[n]
    const at = `${id} S${n}`
    if (e.name !== p.seq[9 - n]) problems.push(`${at}: name '${e.name}' but pathways.js has '${p.seq[9 - n]}'`)
    if (!e.main?.length) problems.push(`${at}: main missing or empty`)
    if (!e.supp?.length) problems.push(`${at}: supp missing or empty`)
    if (!('ritual' in e)) problems.push(`${at}: ritual key absent (use null)`)
    if (n > 5 && e.ritual) problems.push(`${at}: ritual recorded below Sequence 5`)
    for (const k of Object.keys(e)) if (!SEQ_KEYS.includes(k)) problems.push(`${at}: unknown key '${k}'`)
  }
}

const ids = Object.keys(ADVANCEMENT)
const byGroup = {}
for (const p of PATHWAYS) (byGroup[p.group] ??= []).push(Boolean(ADVANCEMENT[p.id]))
const name = g => GROUPS.find(x => x.id === g)?.name ?? g
const complete = Object.entries(byGroup).filter(([, v]) => v.every(Boolean)).map(([g]) => name(g))
const partial = Object.entries(byGroup).filter(([, v]) => v.some(Boolean) && !v.every(Boolean)).map(([g]) => name(g))

// advancement.js is scoped to the 22 standard pathways, so report that
// separately from the 10 non-standard ones which are not expected to have data.
const standardIds = PATHWAYS.filter(p => GROUPS.find(g => g.id === p.group)?.standard).map(p => p.id)
const haveStandard = standardIds.filter(id => ADVANCEMENT[id])
const missingStandard = standardIds.filter(id => !ADVANCEMENT[id])
const nonStandardWithData = ids.filter(id => !standardIds.includes(id))

console.log(`standard pathways:     ${haveStandard.length}/${standardIds.length}` +
  (missingStandard.length ? ` (missing: ${missingStandard.join(', ')})` : ' - complete'))
console.log(`non-standard:          ${nonStandardWithData.length}/${PATHWAYS.length - standardIds.length}` +
  (nonStandardWithData.length ? ` (${nonStandardWithData.join(', ')})` : ' - none, as expected'))
console.log(`sequences recorded:    ${ids.length * 10}`)
console.log(`groups complete: ${complete.join(', ') || 'none'}`)
console.log(`groups partial:  ${partial.join(', ') || 'none'}`)
console.log(problems.length ? `\nPROBLEMS:\n  ${problems.join('\n  ')}` : '\nno problems - every entry validates')
process.exit(problems.length ? 1 : 0)

// Above the Sequence groups (Great Old Ones).
// origin: 'creator' = directly from the Original Creator
//         'outer'   = from an Outer Deity
export const GROUPS = [
  // --- Standard (Earth's 22 pathways live under these 9) ---
  { id: 'LoM', name: 'Lord of Mysteries',        standard: true,  pillar: true,  origin: 'creator' },
  { id: 'GA',  name: 'God Almighty',             standard: true,  pillar: true,  origin: 'creator' },
  { id: 'ED',  name: 'Eternal Darkness',         standard: true,  pillar: true,  origin: 'creator' },
  { id: 'CoD', name: 'Calamity of Destruction',  standard: true,  pillar: false, origin: 'creator' },
  { id: 'DoK', name: 'Demon of Knowledge',       standard: true,  pillar: false, origin: 'creator' },
  { id: 'KoL', name: 'Key of Light',             standard: true,  pillar: false, origin: 'creator' },
  { id: 'GoO', name: 'Goddess of Origin',        standard: true,  pillar: false, origin: 'outer'   },
  { id: 'FoD', name: 'Father of Devils',         standard: true,  pillar: false, origin: 'outer'   },
  { id: 'TA',  name: 'The Anarchy',              standard: true,  pillar: false, origin: 'outer'   },

  // --- Non-standard (Outer Deity pathways) ---
  { id: 'CoI',  name: 'Circle of Inevitability',      standard: false, pillar: false, origin: 'outer' },
  { id: 'MGoD', name: 'Mother Goddess of Depravity',  standard: false, pillar: true,  origin: 'outer' },
  { id: 'MToD', name: 'Mother Tree of Desire',        standard: false, pillar: false, origin: 'outer' },
  { id: 'UM',   name: 'Uncertain Mist',               standard: false, pillar: true,  origin: 'outer' },
  { id: 'PH',   name: 'Primordial Hunger',            standard: false, pillar: false, origin: 'outer' },
  { id: 'SD',   name: 'Supernova Dominator',          standard: false, pillar: false, origin: 'outer' },
  { id: 'IR',   name: 'Inextinguishable Ravings',     standard: false, pillar: false, origin: 'outer' },
  { id: 'MoD',  name: 'Monarch of Decay',             standard: false, pillar: false, origin: 'outer' },
  { id: 'HDO',  name: 'High-Dimensional Overseer',    standard: false, pillar: false, origin: 'outer' },
  { id: 'GoF',  name: 'Goddess of Fate',              standard: false, pillar: false, origin: 'outer' },
]

// Proximity between groups.
// 'neighbouring'          -> all pathways in both groups are neighbouring
// 'compatible'            -> all pathways in both groups are compatible
// 'partial'               -> only the listed pathways of `b` are compatible with `a`
const STANDARD_IDS = ['GA','LoM','ED','CoD','KoL','DoK','FoD','TA','GoO']

// All standard groups are Fully Non-Adjacent with each other, except ED/CoD.
function standardNonAdjacency() {
  const out = []
  for (let i = 0; i < STANDARD_IDS.length; i++) {
    for (let j = i + 1; j < STANDARD_IDS.length; j++) {
      const [a, b] = [STANDARD_IDS[i], STANDARD_IDS[j]]
      if ((a === 'ED' && b === 'CoD') || (a === 'CoD' && b === 'ED')) continue
      out.push({ a, b, kind: 'nonAdjacent' })
    }
  }
  return out
}

export const GROUP_EDGES = [
  ...standardNonAdjacency(),

  // Green: neighbouring
  { a: 'ED',   b: 'CoD',  kind: 'neighbouring', note: 'Fourth Pillar' },
  { a: 'MGoD', b: 'GoO',  kind: 'neighbouring', note: 'split from one Great Old One' },
  { a: 'MToD', b: 'FoD',  kind: 'neighbouring', note: 'split from one Great Old One' },
  { a: 'UM',   b: 'TA',   kind: 'neighbouring', note: 'split from one Great Old One' },

  // Orange: confirmed non-adjacent across the standard/non-standard line
  { a: 'MToD', b: 'ED',   kind: 'nonAdjacent' },
  { a: 'MToD', b: 'CoD',  kind: 'nonAdjacent' },

  // Light blue: partially compatible (only the listed pillar-group pathways)
  { a: 'UM',   b: 'GA',   kind: 'partial', pathways: ['sun'] },
  { a: 'IR',   b: 'GA',   kind: 'partial', pathways: ['visionary', 'hanged-man', 'white-tower'] },
  { a: 'GoF',  b: 'GA',   kind: 'partial', pathways: ['visionary', 'white-tower'] },
  { a: 'HDO',  b: 'GA',   kind: 'partial', pathways: ['visionary'] },
  { a: 'SD',   b: 'GA',   kind: 'partial', pathways: ['sun', 'tyrant'] },
  { a: 'GoF',  b: 'LoM',  kind: 'partial', pathways: ['fool', 'error'] },
  { a: 'CoI',  b: 'LoM',  kind: 'partial', pathways: ['fool', 'error'] },
  { a: 'HDO',  b: 'LoM',  kind: 'partial', pathways: ['error', 'door'] },
  { a: 'GoF',  b: 'ED',   kind: 'partial', pathways: ['darkness'] },
  { a: 'HDO',  b: 'ED',   kind: 'partial', pathways: ['twilight-giant'] },

  // Blue: fully compatible, non-standard to standard
  { a: 'IR',   b: 'DoK',  kind: 'compatible' },
  { a: 'IR',   b: 'FoD',  kind: 'compatible' },
  { a: 'GoF',  b: 'KoL',  kind: 'compatible' },
  { a: 'CoI',  b: 'ED',   kind: 'compatible' },
  { a: 'CoI',  b: 'CoD',  kind: 'compatible' },
  { a: 'CoI',  b: 'KoL',  kind: 'compatible' },
  { a: 'MoD',  b: 'ED',   kind: 'compatible' },
  { a: 'MoD',  b: 'CoD',  kind: 'compatible' },
  { a: 'HDO',  b: 'DoK',  kind: 'compatible' },
  { a: 'HDO',  b: 'TA',   kind: 'compatible' },
  { a: 'SD',   b: 'CoD',  kind: 'compatible' },
  { a: 'SD',   b: 'DoK',  kind: 'compatible' },
  { a: 'SD',   b: 'TA',   kind: 'compatible' },

  // Blue: fully compatible, non-standard to non-standard
  { a: 'MToD', b: 'IR',   kind: 'compatible' },
  { a: 'GoF',  b: 'CoI',  kind: 'compatible' },
  { a: 'CoI',  b: 'MoD',  kind: 'compatible' },
  { a: 'MoD',  b: 'HDO',  kind: 'compatible' },
  { a: 'HDO',  b: 'SD',   kind: 'compatible' },

  // Primordial Hunger: symbol of Convergence, compatible with everything
  ...['GA','LoM','ED','CoD','KoL','DoK','FoD','TA','GoO',
      'MGoD','UM','MToD','IR','GoF','CoI','MoD','HDO','SD']
    .map(b => ({ a: 'PH', b, kind: 'compatible', note: 'Convergence' })),
]

// Pathway-level overlaps that are NOT switchable, but do cause convergence.
// Kept separate because these are exceptions to the group-level rules.
export const HIDDEN_NEIGHBOURING = [
  { a: 'demoness',   b: 'mother',         note: "feminine aspect of Creator and universe" },
  { a: 'demoness',   b: 'moon',           note: "feminine aspect of Creator and universe" },
  { a: 'white-tower', b: 'hermit',        note: 'Knowledge domain overlap' },
  { a: 'white-tower', b: 'paragon',       note: 'Knowledge domain overlap' },
  { a: 'hanged-man', b: 'abyss',          note: 'Heaven and Abyss, shared Degenerate nature' },
  { a: 'error',      b: 'twilight-giant', note: 'overlapping Time authorities' },
  { a: 'justiciar',  b: 'fool',           note: 'authority overlap with Mysteries group' },
  { a: 'justiciar',  b: 'error',          note: 'authority overlap with Mysteries group' },
  { a: 'justiciar',  b: 'door',           note: 'authority overlap with Mysteries group' },
]

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
export const GROUP_EDGES = [
  // Fourth Pillar: separate groups, but neighbouring
  { a: 'ED', b: 'CoD', kind: 'neighbouring', note: 'Fourth Pillar' },

  // Split pairs: one Great Old One divided into two groups
  { a: 'MGoD', b: 'GoO',  kind: 'neighbouring', note: 'split from one Great Old One' },
  { a: 'MToD', b: 'FoD',  kind: 'neighbouring', note: 'split from one Great Old One' },
  { a: 'UM',   b: 'TA',   kind: 'neighbouring', note: 'split from one Great Old One' },

  // Partial compatibility (from the compatibility chart)
  { a: 'GA',  b: 'UM',  kind: 'partial', pathways: ['sun'] },
  { a: 'GA',  b: 'IR',  kind: 'partial', pathways: ['visionary', 'hanged-man', 'white-tower'] },
  { a: 'GA',  b: 'GoF', kind: 'partial', pathways: ['visionary', 'white-tower'] },
  { a: 'GA',  b: 'HDO', kind: 'partial', pathways: ['visionary'] },
  { a: 'GA',  b: 'SD',  kind: 'partial', pathways: ['sun', 'tyrant'] },
  { a: 'LoM', b: 'GoF', kind: 'partial', pathways: ['fool', 'error'] },
  { a: 'LoM', b: 'CoI', kind: 'partial', pathways: ['fool', 'error'] },
  { a: 'LoM', b: 'HDO', kind: 'partial', pathways: ['error', 'door'] },
  { a: 'ED',  b: 'GoF', kind: 'partial', pathways: ['darkness'] },
  { a: 'ED',  b: 'HDO', kind: 'partial', pathways: ['twilight-giant'] },
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
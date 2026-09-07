// Every pathway, with its sequence names ordered from Sequence 9 down to Sequence 0.
// seq[0] is Sequence 9, seq[9] is Sequence 0.
export const PATHWAYS = [
  // ===== Standard =====
  { id: 'fool', name: 'Fool', group: 'LoM', seq: [
    'Seer', 'Clown', 'Magician', 'Faceless', 'Marionettist',
    'Bizarro Sorcerer', 'Scholar of Yore', 'Miracle Invoker', 'Attendant of Mysteries', 'Fool'] },
  { id: 'error', name: 'Error', group: 'LoM', seq: [
    'Marauder', 'Swindler', 'Cryptologist', 'Prometheus', 'Dream Stealer',
    'Parasite', 'Mentor of Deceit', 'Trojan Horse of Destiny', 'Worm of Time', 'Error'] },
  { id: 'door', name: 'Door', group: 'LoM', seq: [
    'Apprentice', 'Trickmaster', 'Astrologer', 'Scribe', 'Traveler',
    'Secrets Sorcerer', 'Wanderer', 'Planeswalker', 'Key of Stars', 'Door'] },

  { id: 'visionary', name: 'Visionary', group: 'GA', seq: [
    'Spectator', 'Telepathist', 'Psychiatrist', 'Hypnotist', 'Dreamwalker',
    'Manipulator', 'Dream Weaver', 'Discerner', 'Author', 'Visionary'] },
  { id: 'sun', name: 'Sun', group: 'GA', seq: [
    'Bard', 'Light Suppliant', 'Solar High Priest', 'Notary', 'Priest of Light',
    'Unshadowed', 'Justice Mentor', 'Lightseeker', 'White Angel', 'Sun'] },
  { id: 'tyrant', name: 'Tyrant', group: 'GA', seq: [
    'Sailor', 'Folk of Rage', 'Seafarer', 'Wind-blessed', 'Ocean Songster',
    'Cataclysmic Interrer', 'Sea King', 'Calamity', 'Thunder God', 'Tyrant'] },
  { id: 'white-tower', name: 'White Tower', group: 'GA', seq: [
    'Reader', 'Student of Ratiocination', 'Detective', 'Polymath', 'Mysticism Magister',
    'Prophet', 'Cognizer', 'Wisdom Angel', 'Omniscient Eye', 'White Tower'] },
  { id: 'hanged-man', name: 'Hanged Man', group: 'GA', seq: [
    'Secrets Suppliant', 'Listener', 'Shadow Ascetic', 'Rose Bishop', 'Shepherd',
    'Black Knight', 'Trinity Templar', 'Profane Presbyter', 'Dark Angel', 'Hanged Man'] },

  { id: 'darkness', name: 'Darkness', group: 'ED', seq: [
    'Sleepless', 'Midnight Poet', 'Nightmare', 'Soul Assurer', 'Spirit Warlock',
    'Nightwatcher', 'Horror Bishop', 'Servant of Concealment', 'Knight of Misfortune', 'Darkness'] },
  { id: 'death', name: 'Death', group: 'ED', seq: [
    'Corpse Collector', 'Gravedigger', 'Spirit Medium', 'Spirit Guide', 'Gatekeeper',
    'Undying', 'Ferryman', 'Death Consul', 'Pale Emperor', 'Death'] },
  { id: 'twilight-giant', name: 'Twilight Giant', group: 'ED', seq: [
    'Warrior', 'Pugilist', 'Weapon Master', 'Dawn Paladin', 'Guardian',
    'Demon Hunter', 'Silver Knight', 'Glory', 'Hand of God', 'Twilight Giant'] },

  { id: 'demoness', name: 'Demoness', group: 'CoD', seq: [
    'Assassin', 'Instigator', 'Witch', 'Pleasure', 'Affliction',
    'Despair', 'Unaging', 'Catastrophe', 'Apocalypse', 'Demoness'] },
  { id: 'red-priest', name: 'Red Priest', group: 'CoD', seq: [
    'Hunter', 'Provoker', 'Pyromaniac', 'Conspirer', 'Reaper',
    'Iron-blooded Knight', 'War Bishop', 'Weather Warlock', 'Conqueror', 'Red Priest'] },

  { id: 'hermit', name: 'Hermit', group: 'DoK', seq: [
    'Mystery Pryer', 'Melee Scholar', 'Warlock', 'Scrolls Professor', 'Constellations Master',
    'Mysticologist', 'Clairvoyant', 'Sage', 'Knowledge Emperor', 'Hermit'] },
  { id: 'paragon', name: 'Paragon', group: 'DoK', seq: [
    'Savant', 'Archaeologist', 'Appraiser', 'Artisan', 'Astronomer',
    'Alchemist', 'Arcane Scholar', 'Knowledge Magister', 'Illuminator', 'Paragon'] },

  { id: 'wheel-of-fortune', name: 'Wheel of Fortune', group: 'KoL', seq: [
    'Monster', 'Robot', 'Lucky One', 'Calamity Priest', 'Winner',
    'Misfortune Mage', 'Chaoswalker', 'Soothsayer', 'Snake of Mercury', 'Wheel of Fortune'] },

  { id: 'mother', name: 'Mother', group: 'GoO', seq: [
    'Planter', 'Doctor', 'Harvest Priest', 'Biologist', 'Druid',
    'Ancient Alchemist', 'Pallbearer', 'Desolate Matriarch', 'Naturewalker', 'Mother'] },
  { id: 'moon', name: 'Moon', group: 'GoO', seq: [
    'Apothecary', 'Beast Tamer', 'Vampire', 'Potions Professor', 'Scarlet Scholar',
    'Shaman King', 'High Summoner', 'Life-Giver', 'Beauty Goddess', 'Moon'] },

  { id: 'abyss', name: 'Abyss', group: 'FoD', seq: [
    'Criminal', 'Unwinged Angel', 'Serial Killer', 'Devil', 'Desire Apostle',
    'Demon', 'Blatherer', 'Bloody Archduke', 'Filthy Monarch', 'Abyss'] },
  { id: 'chained', name: 'Chained', group: 'FoD', seq: [
    'Prisoner', 'Lunatic', 'Werewolf', 'Zombie', 'Wraith',
    'Puppet', 'Disciple of Silence', 'Ancient Bane', 'Abomination', 'Chained'] },

  { id: 'black-emperor', name: 'Black Emperor', group: 'TA', seq: [
    'Lawyer', 'Barbarian', 'Briber', 'Baron of Corruption', 'Mentor of Disorder',
    'Earl of the Fallen', 'Frenzied Mage', 'Duke of Entropy', 'Prince of Abolition', 'Black Emperor'] },
  { id: 'justiciar', name: 'Justiciar', group: 'TA', seq: [
    'Arbiter', 'Sheriff', 'Interrogator', 'Judge', 'Disciplinary Paladin',
    'Imperative Mage', 'Chaos Hunter', 'Balancer', 'Hand of Order', 'Justiciar'] },

  // ===== Non-standard =====
  { id: 'eternal-aeon', name: 'Eternal Aeon', group: 'CoI', seq: [
    'Dancer', 'Alms Monk', 'Contractee', 'Ascetic', 'Fate Appropriator',
    'Circle Inhabitant', 'Sufferer', 'Sinner', 'Angel of Redemption', 'Eternal Aeon'] },
  { id: 'chaos-primogenitor', name: 'Chaos Primogenitor', group: 'MGoD', seq: [
    'Villain', 'Gardener', 'Heretic Spellmaster', 'Sower', 'Banshee',
    'Madame', 'Divine Mother', 'The Supreme', 'Valley God', 'Chaos Primogenitor'] },
  { id: 'patriarch', name: 'Patriarch', group: 'MToD', seq: [
    'Scrooge', 'Sex Addict', 'Actor', 'Recipient', 'Fallen Tree Spirit',
    'Tree Supplicant', 'Desire Priest', 'Cupid', 'Leviathan', 'Patriarch'] },
  { id: 'chaos-mist', name: 'Chaos Mist', group: 'UM', seq: [
    'Broker', 'Shadow Merchant', 'Prosecutor', 'Ambitionist', 'Under the Table',
    'Overseer', 'Vortex Weaver', 'Blasphemer', 'Truth', 'Chaos Mist'] },
  { id: 'tail-devourer', name: 'Tail-Devourer', group: 'PH', seq: [
    'Tramp', 'Glutton', 'Gourmet', 'Chef', 'Depriver',
    'Sea Monster', 'Hydra', 'Angel of Devouring', 'Chaos Gastric Juices', 'Tail-Devourer'] },
  { id: 'condenser', name: 'Condenser', group: 'SD', seq: [
    'Astronomy Aficionado', 'Star Worshipper', 'Star Sacrificer', 'Navigator', 'Tidal Scholar',
    'Heavybringer', 'Star Shepherd', 'Radiant Angel', 'Star Dragon', 'Condenser'] },
  { id: 'everlasting', name: 'Everlasting', group: 'IR', seq: [
    'Initiator', 'Commentator', 'Orator', 'Singer', 'Secret Transmitter',
    'Philosopher', 'Messenger of God', 'Great Old One Attendant', 'Voice of the Heart', 'Everlasting'] },
  { id: 'second-law', name: 'Second Law', group: 'MoD', seq: [
    'Patient', 'Secretary', 'Vermin', 'Disease Envoy', 'Child of Decay',
    'Doomed One', 'Left Hand of Decay', 'Time Giant', 'God of Decay', 'Second Law'] },
  { id: 'sublunary-eye', name: 'Sublunary Eye', group: 'HDO', seq: [
    'Shaman', 'Reporter', 'Painter', 'Literature Enthusiast', 'Pixie',
    'Visitor', 'String Player', 'Dimensional Shadow', 'Observer', 'Sublunary Eye'] },
  { id: 'eternal-edict', name: 'Eternal Edict', group: 'GoF', seq: [
    'Dreamless', 'Musician', 'Fate Pryer', 'Mute', 'Deceased',
    'Fatebender', "Fate's Attendant", 'Web Weaver', 'Blade of Fate', 'Eternal Edict'] },
]

// Sequence number for a given index into `seq` (index 0 -> Sequence 9)
export const seqNumber = (i) => 9 - i
export const seqIndex = (n) => 9 - n

export const getPathway = (id) => PATHWAYS.find(p => p.id === id)
export const pathwaysInGroup = (groupId) => PATHWAYS.filter(p => p.group === groupId)
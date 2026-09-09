# About Pathway Explorer

**Live at [lotm-pathways.vercel.app](https://lotm-pathways.vercel.app/)**

## What this is

*Lord of the Mysteries* runs to well over a thousand chapters, and threaded
through it is one of the most carefully built power systems in web fiction.
Thirty-two pathways, each a ladder of ten Sequences. A potion behind every
Sequence, with ingredients that have to be hunted down and a ritual that has to
be performed. Pathways that sit close enough to switch between, and pathways
that will tear you apart if you try.

None of that arrives in one piece. It accumulates over hundreds of chapters, and
the reference material for it lives spread across a wiki. If you want to answer
something as simple as *what does a Marionettist actually need, and what can a
Fool switch to*, you are opening several tabs.

This puts the whole system on one screen.

## How to read the map

Each glowing sigil is a **pathway**. The faint rings gather pathways under the
**Above the Sequence group** that owns them, the Great Old One at the top of
that ladder. Drag a pathway to pull it around, scroll to zoom, click to open it.

Selecting a pathway gives you its ten Sequences, from Sequence 9 at the bottom
to the Sequence 0 divinity at the top. Open any Sequence for the potion, its
main and supplementary ingredients, and the advancement ritual. Rituals are only
recorded from Sequence 5 upward; below that the potion alone carries you.

The lines are the part worth dwelling on, because they are what makes the system
a map rather than a list. Three kinds:

- **Neighbouring** pathways sit under the same group, or under two groups that
  form a bigger whole. Switching between them adds no madness.
- **Compatible** pathways sit under different groups but share some Symbols and
  Authorities. Switching costs madness, though not enough to stop you.
- **Hidden** pathways genuinely overlap and still cannot be switched between
  directly. They converge more readily than unrelated pathways do.

Connections start hidden so the map opens clean. Turn them on to trace routes.

## Spoilers

The ten outer-deity pathways are material from *Circle of Inevitability*, the
sequel. They stay hidden on every visit until you ask for them.

That hiding is real rather than cosmetic. Their edges, their group rings and
their appearances in other pathways' switch lists are all filtered out, so
nothing about the second book leaks through a side panel while you are reading
the first.

## How it is built

React and Vite, with d3-force laying out the graph and d3-zoom handling pan and
zoom. The starfield is painted once into a canvas rather than kept as several
hundred DOM nodes, which is most of why the page stays cheap to render.

The data is plain JavaScript modules rather than a database, so the whole thing
is a static site and corrections are a pull request. A validator script checks
the advancement data still lines up with the pathway list after any edit.

## Sources and credit

*Lord of the Mysteries* and *Circle of Inevitability* were written by
**Cuttlefish That Loves Diving** (乌贼). All rights to the source material are
theirs.

Everything reference-side in this project comes from the
**[Lord of the Mysteries Wiki](https://lordofthemysteries.fandom.com/)** on
Fandom, and the community of editors who assembled it:

- Pathway and Above the Sequence group listings
- Sequence names and numbering
- Potion formulas, main and supplementary ingredients
- Advancement rituals
- Pathway sigils
- Potion artwork

Fandom community content is published under
[CC BY-SA 3.0](https://www.fandom.com/licensing), and this project reuses it on
those terms. The wiki editors did the work of gathering and cross-checking all
of it; this is a different way of looking at what they compiled, not a
replacement for it.

This is an unofficial, non-commercial fan project. It claims no ownership of the
novels, the setting, or the artwork.

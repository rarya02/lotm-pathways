import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { PATHWAYS, getPathway } from '../data/pathways.js'
import { GROUPS } from '../data/groups.js'
import { PROXIMITY, proximityEdges, switchTargets } from '../data/proximity.js'

const GROUP_COLORS = {
  LoM: '#8b5cf6', GA: '#f59e0b', ED: '#475569', CoD: '#dc2626',
  DoK: '#0891b2', KoL: '#eab308', GoO: '#16a34a', FoD: '#7c2d12', TA: '#1e40af',
  CoI: '#a855f7', MGoD: '#be123c', MToD: '#65a30d', UM: '#64748b',
  PH: '#ea580c', SD: '#0ea5e9', IR: '#d946ef', MoD: '#78716c',
  HDO: '#14b8a6', GoF: '#6366f1',
}

const EDGE_STYLE = {
  neighbouring: { stroke: '#4ade80', width: 2,   dash: null,    opacity: 0.5,  distance: 80 },
  compatible:   { stroke: '#fbbf24', width: 1.2, dash: '5,5',   opacity: 0.22, distance: 160 },
  hidden:       { stroke: '#94a3b8', width: 1,   dash: '1.5,5', opacity: 0.20, distance: 210 },
}

// Primordial Hunger is the symbol of Convergence: compatible with every other
// pathway. On the rim it throws 31 lines across the whole canvas, so it sits in
// the middle and its edges read as spokes instead.
const CENTRE_GROUP = 'PH'

const NODE_R = 11
const HALO_R = 20

// Deterministic PRNG so the sky and the initial layout are identical on every
// rebuild (resize, toggling hidden edges) instead of reshuffling.
const seededRandom = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647

export default function PathwayGraph() {
  const svgRef = useRef(null)
  const tipRef = useRef(null)
  const zoomRef = useRef(null)
  const highlightRef = useRef(null)
  const selectedRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [showHidden, setShowHidden] = useState(true)
  const [size, setSize] = useState({ width: 0, height: 0 })

  selectedRef.current = selected

  // The viewBox tracks the real pixel box, so one SVG unit is one CSS pixel and
  // nothing gets letterboxed or rescaled.
  useLayoutEffect(() => {
    const el = svgRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize(prev =>
        Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1
          ? prev
          : { width, height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const { width, height } = size
    if (!width || !height) return

    const cx = width / 2
    const cy = height / 2

    // Standard groups hold 22 of the 32 pathways, so they get the outer ring
    // where there is circumference to spread into. The non-standard groups are
    // one pathway each and sit comfortably on a tighter inner ring.
    const outer = GROUPS.filter(g => g.standard)
    const inner = GROUPS.filter(g => !g.standard && g.id !== CENTRE_GROUP)

    // Margins leave room for the group labels that sit outside the rings, but
    // scale down on small canvases where a fixed margin would eat the layout.
    const marginX = Math.max(104, Math.min(150, width * 0.145))
    const marginY = Math.max(92, Math.min(130, height * 0.17))
    const outerRx = Math.max(200, width / 2 - marginX)
    const outerRy = Math.max(150, height / 2 - marginY)
    const innerRx = outerRx * 0.44
    const innerRy = outerRy * 0.50

    const anchors = { [CENTRE_GROUP]: { x: cx, y: cy } }
    outer.forEach((g, i) => {
      const a = (i / outer.length) * 2 * Math.PI - Math.PI / 2
      anchors[g.id] = { x: cx + Math.cos(a) * outerRx, y: cy + Math.sin(a) * outerRy }
    })
    // Offset by half a step so inner groups sit in the gaps between outer ones.
    inner.forEach((g, i) => {
      const a = (i / inner.length) * 2 * Math.PI - Math.PI / 2 + Math.PI / inner.length
      anchors[g.id] = { x: cx + Math.cos(a) * innerRx, y: cy + Math.sin(a) * innerRy }
    })

    // Start each node at its anchor with a deterministic spiral offset, so the
    // simulation converges to the same layout every time.
    const groupSize = {}
    PATHWAYS.forEach(p => { groupSize[p.group] = (groupSize[p.group] ?? 0) + 1 })

    const nodes = PATHWAYS.map((p, i) => {
      const a = anchors[p.group]
      const t = i * 2.39996
      return {
        ...p,
        ax: a.x, ay: a.y,
        solo: groupSize[p.group] === 1,
        x: a.x + Math.cos(t) * 24,
        y: a.y + Math.sin(t) * 24,
        // Collide radius accounts for the label, so long names push apart.
        cr: 26 + Math.min(20, p.name.length * 1.1),
      }
    })

    const links = proximityEdges()
      .filter(e => EDGE_STYLE[e.kind])
      .filter(e => showHidden || e.kind !== 'hidden')
      .map(e => ({ ...e }))

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('viewBox', [0, 0, width, height])

    // --- Sky: a static layer behind the zoom container, so it reads as a
    // distant backdrop rather than scaling with the graph.
    const sky = svg.append('g').attr('class', 'sky').attr('pointer-events', 'none')
    const rng = seededRandom(42)
    const stars = d3.range(260).map(() => {
      const r = Math.pow(rng(), 2.2) * 1.5 + 0.25
      return { x: rng() * width, y: rng() * height, r, o: 0.18 + r * 0.42 }
    })

    // A handful of brighter stars get a soft bloom for depth.
    sky.append('g').selectAll('circle')
      .data(stars.filter(s => s.r > 1.15)).join('circle')
      .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', d => d.r * 4)
      .attr('fill', '#8ea2d8').attr('opacity', 0.12)

    sky.append('g').selectAll('circle')
      .data(stars).join('circle')
      .attr('cx', d => d.x).attr('cy', d => d.y).attr('r', d => d.r)
      .attr('fill', '#dbe4fb').attr('opacity', d => d.o)
      .attr('class', (d, i) => (i % 7 === 0 ? 'star-tw' : null))
      .style('--o', d => d.o)
      .style('--dur', () => `${(4 + rng() * 6).toFixed(1)}s`)
      .style('animation-delay', () => `${(rng() * 8).toFixed(1)}s`)

    const container = svg.append('g')

    let panned = false
    const zoom = d3.zoom()
      .scaleExtent([0.75, 3])
      .translateExtent([[-200, -200], [width + 200, height + 200]])
      .on('start', () => { panned = false })
      .on('zoom', (e) => { panned = true; container.attr('transform', e.transform) })
    svg.call(zoom)
    zoomRef.current = { svg, zoom }

    // --- Group rings, sized per tick from the members they actually contain.
    const groupData = GROUPS
      .map(g => ({ ...g, members: nodes.filter(n => n.group === g.id) }))
      .filter(g => g.members.length)

    const ringLayer = container.append('g').attr('pointer-events', 'none')
    const ring = ringLayer.selectAll('circle').data(groupData).join('circle')
      .attr('fill', d => GROUP_COLORS[d.id]).attr('fill-opacity', 0.045)
      .attr('stroke', d => GROUP_COLORS[d.id]).attr('stroke-opacity', 0.22)
      .attr('stroke-width', 1)

    // Only multi-pathway groups get a floating label. A single-pathway group has
    // roughly 100px of arc but a name like "Mother Goddess of Depravity" needs
    // ~124px, so those are surfaced on hover instead of overprinting the graph.
    const labelled = groupData.filter(g => g.members.length > 1 || g.id === CENTRE_GROUP)

    const ringLabel = ringLayer.selectAll('text').data(labelled).join('text')
      .attr('font-family', 'Cinzel, serif')
      .attr('font-size', 11)
      .attr('font-weight', 600)
      .attr('letter-spacing', '0.09em')
      .attr('dominant-baseline', 'middle')
      .attr('fill', d => GROUP_COLORS[d.id])
      .attr('opacity', 0.85)
      .attr('paint-order', 'stroke')
      .attr('stroke', '#04060e').attr('stroke-width', 3.5)
      .text(d => d.name)

    // Real text widths, so labels can be kept inside the frame rather than
    // running off the edge.
    const measureLabels = () => {
      ringLabel.each(function (d) {
        d.tw = this.getComputedTextLength ? this.getComputedTextLength() : d.name.length * 6
      })
    }
    measureLabels()

    const link = container.append('g')
      .selectAll('line').data(links).join('line')
      .attr('stroke', d => EDGE_STYLE[d.kind].stroke)
      .attr('stroke-width', d => EDGE_STYLE[d.kind].width)
      .attr('stroke-dasharray', d => EDGE_STYLE[d.kind].dash)
      .attr('stroke-opacity', d => EDGE_STYLE[d.kind].opacity)

    const node = container.append('g')
      .selectAll('g').data(nodes).join('g')
      .style('cursor', 'pointer')

    // Halo + core reads as a glowing body without needing a blur filter.
    node.append('circle')
      .attr('class', 'halo')
      .attr('r', HALO_R)
      .attr('fill', d => GROUP_COLORS[d.group] ?? '#999')
      .attr('opacity', 0.16)

    node.append('circle')
      .attr('r', NODE_R)
      .attr('fill', d => GROUP_COLORS[d.group] ?? '#999')
      .attr('stroke', '#04060e').attr('stroke-width', 2)

    node.append('text')
      .text(d => d.name)
      .attr('y', 32).attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('fill', '#dbe4fb')
      .attr('paint-order', 'stroke').attr('stroke', '#04060e').attr('stroke-width', 3.5)

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id)
        .distance(d => EDGE_STYLE[d.kind].distance).strength(0.02))
      .force('charge', d3.forceManyBody().strength(-100))
      // Single-pathway groups hold their ring position harder, so the inner
      // ring stays a ring instead of scattering into the outer clusters.
      .force('x', d3.forceX(d => d.ax).strength(d => d.solo ? 0.85 : 0.6))
      .force('y', d3.forceY(d => d.ay).strength(d => d.solo ? 0.85 : 0.6))
      .force('collide', d3.forceCollide(d => d.cr).strength(0.9))

    // Nodes can never leave the frame, whatever the forces do.
    const padX = 62
    const padY = 34
    function clamp() {
      for (const n of nodes) {
        n.x = Math.max(padX, Math.min(width - padX, n.x))
        n.y = Math.max(padY, Math.min(height - padY, n.y))
      }
    }

    function drawGroups() {
      for (const g of groupData) {
        let gx = 0, gy = 0
        for (const n of g.members) { gx += n.x; gy += n.y }
        gx /= g.members.length; gy /= g.members.length
        let far = 0
        for (const n of g.members) far = Math.max(far, Math.hypot(n.x - gx, n.y - gy))
        g.cx = gx; g.cy = gy; g.r = far + 30

        // Push the label radially outward from the centre of the diagram, so
        // inner labels land in the gap between rings and outer labels sit clear.
        const dx = gx - cx, dy = gy - cy
        const len = Math.hypot(dx, dy) || 1
        // Identify the hub by id: it drifts a few px off centre, which a
        // distance test would misread as a direction.
        const centre = g.id === CENTRE_GROUP
        let ux, uy
        if (centre) {
          // Below its node, clear of the hub of edges converging on it.
          ux = 0; uy = 1
        } else {
          // Bias every label up-and-outward so it clears the horizontal row of
          // node labels at the group's own height.
          ux = dx / len
          uy = dy / len - 0.5
          const m = Math.hypot(ux, uy) || 1
          ux /= m; uy /= m
        }
        const off = g.r + (centre ? 42 : 18)
        g.lx = gx + ux * off
        g.ly = gy + uy * off
        g.anchor = Math.abs(ux) < 0.35 ? 'middle' : (ux > 0 ? 'start' : 'end')

        const tw = g.tw ?? 0
        const pad = 8
        const labelLeft = () =>
          g.anchor === 'middle' ? g.lx - tw / 2 : g.anchor === 'start' ? g.lx : g.lx - tw

        // Keep the whole label inside the canvas.
        const fit = () => {
          const l = labelLeft()
          if (l < pad) g.lx += pad - l
          else if (l + tw > width - pad) g.lx -= l + tw - (width - pad)
          g.ly = Math.max(14, Math.min(height - 14, g.ly))
        }
        fit()

        // A group near the frame edge gets clamped back on top of its own
        // nodes; stack the label above the ring instead (below, if no room).
        const l = labelLeft()
        const onRing = l < gx + g.r && l + tw > gx - g.r &&
                       g.ly + 7 > gy - g.r && g.ly - 7 < gy + g.r
        if (!centre && onRing) {
          g.anchor = 'middle'
          g.lx = gx
          g.ly = gy - g.r - 14
          if (g.ly < 16) g.ly = gy + g.r + 16
          fit()
        }
      }
      ring.attr('cx', d => d.cx).attr('cy', d => d.cy).attr('r', d => d.r)
      ringLabel.attr('x', d => d.lx).attr('y', d => d.ly).attr('text-anchor', d => d.anchor)
    }

    function draw() {
      link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
      node.attr('transform', d => `translate(${d.x},${d.y})`)
      drawGroups()
    }

    // Settle before the first paint so the graph appears composed rather than
    // exploding outward. sim.tick() does not dispatch events, hence the manual
    // clamp here.
    sim.stop()
    for (let i = 0; i < 280; i++) { sim.tick(); clamp() }
    draw()
    sim.on('tick', () => { clamp(); draw() })
    sim.alpha(0.03).restart()

    // Cinzel may still be loading when the first measurement runs.
    let alive = true
    document.fonts?.ready.then(() => { if (alive) { measureLabels(); drawGroups() } })

    const connected = (id) => new Set(
      links.filter(l => l.source.id === id || l.target.id === id)
           .flatMap(l => [l.source.id, l.target.id])
    )

    function highlight(id) {
      if (!id) {
        link.attr('stroke-opacity', d => EDGE_STYLE[d.kind].opacity)
        node.attr('opacity', 1)
        ring.attr('stroke-opacity', 0.22)
        ringLabel.attr('opacity', 0.85)
        return
      }
      const keep = connected(id)
      link.attr('stroke-opacity', l =>
        (l.source.id === id || l.target.id === id)
          ? Math.max(0.9, EDGE_STYLE[l.kind].opacity)
          : 0.04)
      node.attr('opacity', d => (d.id === id || keep.has(d.id)) ? 1 : 0.18)
      const live = new Set(nodes.filter(n => n.id === id || keep.has(n.id)).map(n => n.group))
      ring.attr('stroke-opacity', d => live.has(d.id) ? 0.35 : 0.07)
      ringLabel.attr('opacity', d => live.has(d.id) ? 0.9 : 0.25)
    }
    highlightRef.current = highlight
    highlight(selectedRef.current)

    node.on('click', (event, d) => {
      event.stopPropagation()
      setSelected(d.id)
    })
    svg.on('click', () => { if (!panned) setSelected(null) })

    const stage = svgRef.current.parentNode
    const groupName = (id) => GROUPS.find(g => g.id === id)?.name ?? id

    const placeTip = (event) => {
      const tip = tipRef.current
      if (!tip) return
      const r = stage.getBoundingClientRect()
      let x = event.clientX - r.left + 16
      const y = event.clientY - r.top + 16
      if (x + tip.offsetWidth > r.width - 8) x = event.clientX - r.left - tip.offsetWidth - 16
      tip.style.left = `${x}px`
      tip.style.top = `${Math.min(y, r.height - tip.offsetHeight - 8)}px`
    }

    node
      .on('mouseenter', function (event, d) {
        d3.select(this).select('.halo').attr('opacity', 0.34)
        const tip = tipRef.current
        if (!tip) return
        tip.innerHTML = ''
        const a = document.createElement('span')
        a.className = 'tip-name'
        a.textContent = d.name
        const b = document.createElement('span')
        b.className = 'tip-group'
        b.textContent = groupName(d.group)
        b.style.color = GROUP_COLORS[d.group] ?? '#999'
        tip.append(a, b)
        tip.hidden = false
        placeTip(event)
      })
      .on('mousemove', placeTip)
      .on('mouseleave', function () {
        d3.select(this).select('.halo').attr('opacity', 0.16)
        if (tipRef.current) tipRef.current.hidden = true
      })

    node.call(d3.drag()
      .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.2).restart(); d.fx = d.x; d.fy = d.y })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y })
      .on('end', (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null }))

    return () => { alive = false; sim.stop(); highlightRef.current = null }
  }, [showHidden, size.width, size.height])

  // Selecting from the side panel has to drive the same highlight as clicking
  // a node in the graph.
  useEffect(() => { highlightRef.current?.(selected) }, [selected])

  const sel = selected ? getPathway(selected) : null

  return (
    <div className="graph-wrap">
      <div className="graph-main">
        <div className="controls">
          <label>
            <input type="checkbox" checked={showHidden}
              onChange={e => setShowHidden(e.target.checked)} />
            Show hidden neighbouring
          </label>
          <span className="legend">
            <span><i style={{ borderTopColor: '#4ade80' }} /> Neighbouring</span>
            <span><i style={{ borderTopColor: '#fbbf24', borderTopStyle: 'dashed' }} /> Compatible</span>
            <span><i style={{ borderTopColor: '#94a3b8', borderTopStyle: 'dotted' }} /> Hidden</span>
          </span>
        </div>
        <div className="graph-stage">
          <svg ref={svgRef} className="graph-svg" />
          <div className="tip" ref={tipRef} hidden />
          <button className="reset-btn" onClick={() => {
            const { svg, zoom } = zoomRef.current ?? {}
            if (svg) svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity)
          }}>Reset view</button>
        </div>
      </div>

      <aside className="panel">
        {!sel && (
          <p className="hint">
            Each circle is a <strong>pathway</strong>. Rings group them under their
            <strong> Great Old One</strong>, with <strong>Primordial Hunger</strong> at
            the centre — the symbol of Convergence, compatible with everything.
            <br /><br />
            Click a pathway to see its ten sequences and where it can lead.
            Drag to rearrange, scroll to zoom.
          </p>
        )}
        {sel && (
          <>
            <h2 style={{ color: GROUP_COLORS[sel.group] }}>{sel.name}</h2>
            <p className="group">{GROUPS.find(g => g.id === sel.group)?.name}</p>

            <h3>Sequences</h3>
            <ol className="seqlist">
              {sel.seq.map((name, i) => (
                <li key={i}><span className="num">{9 - i}</span> {name}</li>
              ))}
            </ol>

            <h3>Can switch to</h3>
            <ul className="targets">
              {switchTargets(sel.id).map(t => (
                <li key={t.id} onClick={() => setSelected(t.id)}>
                  <span className="dot" style={{ background: GROUP_COLORS[t.group] }} />
                  {t.name}
                  <em>{PROXIMITY[t.kind].label}</em>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>
    </div>
  )
}

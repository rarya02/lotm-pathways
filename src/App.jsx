import PathwayGraph from './components/PathwayGraph.jsx'
import Starfield from './components/Starfield.jsx'
import './App.css'

export default function App() {
  return (
    <>
      <Starfield />
      <div className="app">
        <header>
          <p className="eyebrow">
            <span>Lord of Mysteries</span>{' '}
            <span className="sep">|</span>{' '}
            <span>Circle of Inevitability</span>
          </p>
          <h1>Pathway Explorer</h1>
          <p className="tagline">
            32 pathways, 19 Above the Sequence groups, and the proximity between them.
          </p>
        </header>
        <PathwayGraph />
        <footer>
          Sequence 9 is the first step. Sequence 0 is a Great Old One.
        </footer>
      </div>
    </>
  )
}

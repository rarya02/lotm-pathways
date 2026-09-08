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
        </header>
        <PathwayGraph />
      </div>
    </>
  )
}

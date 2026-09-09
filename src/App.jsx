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
        {/* CC BY-SA attribution belongs where the content is used, not only in
            the repository. */}
        <footer className="credit">
          Unofficial fan project. Pathway data and artwork from the{' '}
          <a href="https://lordofthemysteries.fandom.com/" target="_blank" rel="noopener noreferrer">
            Lord of the Mysteries Wiki
          </a>{' '}
          under{' '}
          <a href="https://www.fandom.com/licensing" target="_blank" rel="noopener noreferrer">
            CC BY-SA 3.0
          </a>. Novels by Cuttlefish That Loves Diving.
        </footer>
      </div>
    </>
  )
}

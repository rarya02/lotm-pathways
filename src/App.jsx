import PathwayGraph from './components/PathwayGraph.jsx'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Pathway Explorer</h1>
        <p>32 pathways, 19 Above the Sequence groups, and the proximity between them.</p>
      </header>
      <PathwayGraph />
    </div>
  )
}
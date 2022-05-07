import { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [satellites, setSatellites] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const url = 'http://localhost:3100/api/near-me?lat=40.700006352618544&lon=-74.04903955504285&qty=3'
      const response = await fetch(url);
      const data = await response.json();
      setSatellites(data);
    }

    fetchData();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.jsx</code> and save to test HMR updates.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
        <p>Satellites</p>
        <ul>
          {satellites.map(satellite => (
            <li>id: { satellite['id'] }</li>
          ))}
        </ul>
      </header>
    </div>
  )
}

export default App

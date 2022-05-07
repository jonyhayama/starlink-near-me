import { useState, useEffect } from 'react'

function App() {
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
    <div>
      <p>Satellites</p>
      <ul>
        {satellites.map(satellite => (
          <li>id: { satellite['id'] }</li>
        ))}
      </ul>
    </div>
  )
}

export default App

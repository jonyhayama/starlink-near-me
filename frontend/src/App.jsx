import { useState, useEffect } from 'react'
import ReactGlobe from 'react-globe.gl';

function App() {
  const [satellites, setSatellites] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const url = 'http://localhost:3100/api/near-me?lat=40.700006352618544&lon=-74.04903955504285&qty=50'
      const response = await fetch(url);
      const data = await response.json();
      setSatellites(data);
    }

    fetchData();
  }, [])

  return (
    <div>
      <ReactGlobe 
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        
        objectsData={satellites}
        objectLat={d => d.latitude}
        objectLng={d => d.longitude}
        objectAltitude={d => d.height_km / 3500}
        objectText={() => ''}
        objectSize={0.7}
        objectDotRadius={0.7}
        objectColor={() => 'rgba(255, 165, 0, 0.75)'}
        objectResolution={1}
      />
    </div>
  )
}

export default App

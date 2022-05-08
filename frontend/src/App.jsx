import { useState, useEffect, useRef } from 'react'
import ReactGlobe from 'react-globe.gl';

const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const globeEl = useRef();
  const [satellites, setSatellites] = useState([])
  const [location, setLocation] = useState([{
    lat: 40.695841666625206,
    lng: -74.04423303705076
  }])

  const handleClick = (globeLocation) => {
    setLocation([globeLocation])
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        setLocation([{
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }])
      }, function(error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      });
    }
  }, [])

  useEffect(() => {
    const { lat, lng } = location[0]
    const fetchData = async () => {
      const url = `${API_URL}/api/near-me?lat=${lat}&lng=${lng}&qty=50`
      const response = await fetch(url);
      const data = await response.json();
      setSatellites(data);
    }

    globeEl.current.pointOfView({ lat, lng });
    fetchData();
  }, [location])

  return (
    <div>
      <header className='main-header'>
        <h1>Starlink™ near me</h1>
      </header>
      <ReactGlobe
        ref={globeEl}
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

        labelsData={location}
        labelLat={d => d.lat}
        labelLng={d => d.lng}
        labelText={() => 'Me'}
        labelSize={() => 1}
        labelDotRadius={() => 1}
        labelColor={() => 'rgba(255, 165, 0, 0.75)'}
        labelResolution={2}

        onGlobeClick={handleClick}
      />
      <footer className='main-footer'>
        <strong>DISCLAIMER:</strong>
        <p>I'm not affiliated, associated, authorized, endorsed by, or in any way officially connected with Space Exploration Technologies Corp (SpaceX), or any of its subsidiaries or its affiliates. The names SpaceX as well as related names, marks, emblems and images are registered trademarks of their respective owners.</p>
      </footer>
    </div>
  )
}

export default App

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
      navigator.geolocation.getCurrentPosition(function (position) {
        setLocation([{
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }])
      }, function (error) {
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
      <a href="https://github.com/jonyhayama/starlink-near-me" className="github-corner" aria-label="View source on GitHub">
        <svg width="80" height="80" viewBox="0 0 250 250" style={{ fill: '#fff', color: '#151513', position: 'absolute', top: 0, border: 0, right: 0 }} aria-hidden="true">
          <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
          <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style={{ transformOrigin: '130px 106px' }} className="octo-arm"></path>
          <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" className="octo-body"></path>
        </svg>
      </a>
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

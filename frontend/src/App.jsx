import { useState, useEffect, useRef } from 'react'
import ReactGlobe from 'react-globe.gl';

const API_URL = import.meta.env.VITE_API_URL || '';

function App() {
  const globeEl = useRef();
  const [satellites, setSatellites] = useState([])
  const [location, setLocation] = useState([{
    lat: 40.695841666625206,
    lng: -74.04423303705076,
    qty: 50
  }])
  const [formState, setFormState] = useState(location[0])
  const [isConfigVisible, setIsConfigVisible] = useState(false)

  const handleClick = (globeLocation) => {
    const newLocation = { ...formState, ...globeLocation };
    setFormState(newLocation)
    setLocation([newLocation])
  }

  const handleForm = (e) => {
    e.preventDefault();
    setLocation([{ ...location, ...formState }])
    setIsConfigVisible(false)
    return false;
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const newLocation = {
          ...formState,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setFormState(newLocation)
        setLocation([newLocation])
      }, function (error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      });
    }
  }, [])

  useEffect(() => {
    const { lat, lng, qty } = location[0]
    const fetchData = async () => {
      const url = `${API_URL}/api/near-me?lat=${lat}&lng=${lng}&qty=${qty}`
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
      <aside className={`config ${isConfigVisible ? 'visible' : ''} `}>
        <a href="#" className='toggle' onClick={(e) => {
          e.preventDefault();
          setIsConfigVisible(!isConfigVisible);
        }}>
          <span>Toggle Config</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/></svg>
        </a>
        <form onSubmit={handleForm}>
          <label>Latitude:</label>
          <input type="number" name="lat" step="0.00000000000001" value={formState.lat} onChange={(e) => setFormState({...formState, lat: e.target.value }) } />
          <label>Longitude:</label>
          <input type="number" name="lng" step="0.00000000000001" value={formState.lng} onChange={(e) => setFormState({...formState, lng: e.target.value }) } />
          <label>Quantity of Satellites:</label>
          <input type="number" name="qty" step="1" min="1" max="100" value={formState.qty} onChange={(e) => setFormState({...formState, qty: e.target.value }) } />
          <button>Save</button>
        </form>
      </aside>
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

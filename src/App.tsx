import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { calculateScore, getPositionFromCountryList } from './utils/utils'
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import { Position } from './utils/utils';

function App() {

  const [guessTemp, setguessTemp] = useState("")
  const [actualTemp, setActualTemp] = useState("")
  const [score, setScore] = useState(0)
  const [pos, setPosition] = useState<Position | null>(null);

  const apiKey = import.meta.env.VITE_WEATHER_API
  const mapKey = import.meta.env.VITE_MAP_API

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const temp = await getGeocoding()
    setActualTemp(temp)

    // can add to cumulative score
    setScore(calculateScore(parseFloat(guessTemp), parseFloat(temp)))
  }

  const getGeocoding = async () => {
    if (pos) {
      const lat = pos.lat
      const lon = pos.lng
      const unit = 'imperial'
      
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`
      try {
        const res = await axios.get(url)
        const temp = res.data.main.temp
        return temp
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    }
  }


  const handleGetLocation = async () => {
    const res = await getPositionFromCountryList();
    if (res) {
      setPosition(res)
      console.log(res, 'onClick')
    }
  };

  useEffect(() => {
    const fetchInitialPosition = async () => {
      try {
        const res = await getPositionFromCountryList()
        setPosition(res)
        console.log(res, 'useeffect')
      } catch (error) {
        console.error("Error fetching position in app", error)
      }
    }

    fetchInitialPosition()

  }, [])

  return (
    <>
      {pos !== null && (
        <div className="map">
          <APIProvider apiKey={mapKey} onLoad={() => console.log('Maps API has loaded.')}>
            <Map 
              defaultCenter={pos}
              center={pos}
              defaultZoom={7}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              <Marker position={pos} />
            </Map>
          </APIProvider>
        </div>
      )}

      {score != null && (
        <div>
          {score}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          value={guessTemp}
          onChange={(e) => setguessTemp(e.target.value)}
          type='number'
          required
        />
        <button type='submit'>Submit</button>
      </form>

      <div>
        <p>Guess Temperature: {guessTemp}°F</p>
      </div>

      {actualTemp !== null && (
        <div>
          <p>Actual Temperature: {actualTemp}°F</p>
        </div>
      )}

      {pos !== null && (
        <div>
          <button onClick={handleGetLocation}>
            Get Location
          </button>

          {pos.lat} , {pos.lng} 
      </div>
      )}


    </>
  )
}

export default App

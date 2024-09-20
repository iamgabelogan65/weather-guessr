import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { calculateScore, getPosition } from './utils/utils'
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';

function App() {

  const [guessTemp, setguessTemp] = useState("")
  const [actualTemp, setActualTemp] = useState("")
  const [pos, setPosition] = useState(getPosition())
  const [score, setScore] = useState(0)

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
    const lat = pos.lat
    const lon = pos.lng
    const unit = 'imperial'
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`
    const res = await axios.get(url)
    
    const temp = res.data.main.temp
    return temp
  }


  return (
    <>
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

      <div>
        <button onClick={() => setPosition(getPosition())}>
          get location
        </button>

        {pos.lat} , {pos.lng} 
      </div>
      <APIProvider apiKey={mapKey} onLoad={() => console.log('Maps API has loaded.')}>
        <Map 
            style={{width: '500px', height: '500px'}}
            defaultCenter={pos}
            center={pos}
            defaultZoom={3}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
        >
          <Marker position={pos} />
        </Map>
      </APIProvider>
    </>
  )
}

export default App

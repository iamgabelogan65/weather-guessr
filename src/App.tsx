import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import { calculateScore, getPosition, getPositionFromCountryList } from './utils/utils'
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import { Position } from './utils/utils';

function App() {

  const [guessTemp, setguessTemp] = useState("")
  const [actualTemp, setActualTemp] = useState("")
  const [score, setScore] = useState(0)
  const [pos, setPosition] = useState<Position | null>(null)
  const [formDisabled, setFormDisabled] = useState(false)

  const threshold = 0.90
  const [totalScore, setTotalScore] = useState(0)


  const apiKey = import.meta.env.VITE_WEATHER_API
  const mapKey = import.meta.env.VITE_MAP_API

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const temp = await getGeocoding()
    setActualTemp(temp)

    // can add to cumulative score

    if (temp !== null) {
      const scoreAccuracy = calculateScore(parseFloat(guessTemp), parseFloat(temp))
      if (scoreAccuracy >= threshold) {
        setScore(prevScore => prevScore + 1)
      }
      setTotalScore(prevScore => prevScore + 1)
    }

    setFormDisabled(true)
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
    setFormDisabled(false)
  };

  const handleRefresh = async () => {
    const res = await getPositionFromCountryList();
    if (res) {
      setPosition(res)
      setScore(0)
      setTotalScore(0)
      console.log(res, 'onClick')
    }
    setFormDisabled(false)
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
    <div className='app-container'>
      {pos !== null && (
        <div className='map-container'>
          <APIProvider apiKey={mapKey} onLoad={() => console.log('Maps API has loaded.')}>
              <Map
                defaultCenter={pos}
                center={pos}
                defaultZoom={3}
                gestureHandling={'none'}
                disableDefaultUI={true}
              >
                <Marker position={pos} />
              </Map>
          </APIProvider>
      </div>
      )}

      <div className='score-container'>
        {actualTemp !== null && (
          <div>
            <p>Actual Temperature: {actualTemp}°F</p>
          </div>
        )}

        {score != null && (
          <div>
            <p>Score: {score} / {totalScore}</p>
          </div>
        )}
      </div>

      <div className='form-container'>
        <button onClick={handleRefresh}>
          Refresh
        </button>

        <form onSubmit={handleSubmit}>
          <input
            value={guessTemp}
            onChange={(e) => setguessTemp(e.target.value)}
            type='number'
            required
          />
          <button type='submit' disabled={formDisabled}>Submit</button>
        </form>


        <button onClick={handleGetLocation}>
          Get Location
        </button>
      </div>
    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import axios from 'axios'
import { calculateScore, getPositionFromCountryList } from './utils/utils'
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import { Position } from './utils/utils';
import { RefreshButton } from './components/RefreshButton';
import NextButton from './components/NextButton';

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
    <div className='app-container'>
      {pos !== null && (
        <div className='map-container'>
          <APIProvider apiKey={mapKey} onLoad={() => console.log('Maps API has loaded.')}>
              <Map
                defaultCenter={pos}
                center={pos}
                defaultZoom={7}
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
            <p>Score: {score}</p>
          </div>
        )}
      </div>

      <div className='form-container'>
        {/* <button onClick={handleGetLocation}>
          Refresh
        </button> */}
        <RefreshButton onClick={handleGetLocation} />

        <form onSubmit={handleSubmit}>
          <div className='input-container'>
            <label>Guess</label>
            <input
              className='input-field'
              value={guessTemp}
              onChange={(e) => setguessTemp(e.target.value)}
              type='number'
              placeholder='23.66'
              required
            />
          </div>
        </form>


        <NextButton onClick={handleGetLocation} />
      </div>
    </div>
  )
}

export default App

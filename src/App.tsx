import { useState } from 'react'
import './App.css'
import axios from 'axios'
import { getPosition } from './utils/utils'

function App() {

  const [guessTemp, setguessTemp] = useState("")
  const [actualTemp, setActualTemp] = useState("")

  const apiKey = import.meta.env.VITE_WEATHER_API

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const temp = await getGeocoding()
    setActualTemp(temp)
  }

  const getGeocoding = async () => {
    const lat = 37.368832
    const lon = -122.036346
    const unit = 'imperial'
    
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`
    const res = await axios.get(url)
    
    const temp = res.data.main.temp
    return temp
  }


  const [pos, setPosition] = useState(getPosition())

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={guessTemp}
          onChange={(e) => setguessTemp(e.target.value)}
        />
        <button>Submit</button>
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

        {pos.latitude} , {pos.longitude} 
      </div>
    </>
  )
}

export default App

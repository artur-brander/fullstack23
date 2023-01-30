import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ country }) => {
    const api_key = process.env.REACT_APP_API_KEY
    const [weather, setWeather] = useState([])
    
    const latLng = country.latlng
    console.log(country, latLng);
    
    useEffect(() => {
      console.log('Effect started, fetching data from WEATHER API')
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latLng[0]}&lon=${latLng[1]}&appid=${api_key}&units=metric`)
        .then(response => {
          console.log('weather: ', response.data);
          setWeather(response.data)
        })
        .catch(error => console.log(error))
    }, [])
  
    return(
      <>
      {weather.main ? (
      <div>
        <h2>Weather in {country.capital}</h2>
        
        <p>temperature: {weather.main.temp} Celsius</p>
        <img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="weather icon"
        />
        <p>wind: {weather.wind.speed} m/s</p>
      </div>
      ) : `Weather data isn't available.`}
      </>
    )
  
  }

  export default Weather
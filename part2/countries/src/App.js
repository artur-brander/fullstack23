import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryQuery from './components/CountryQuery'
import DisplayCountries from './components/DisplayCountries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [query, setQuery] = useState('')
  const [displayedCountries, setDisplayedCountries] = useState([])
  
  useEffect(() => {
    console.log('Effect started, fetching data from REST API');
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('countries: ', response.data.map(c => c.name.common)); 
        setCountries(response.data)
      })
      .catch(error => console.log(error))
  }, [])

  return (
    <div>
      find countries
      <CountryQuery 
        query={query} 
        setQuery={setQuery} 
        countries={countries} 
        setDisplayedCountries={setDisplayedCountries} 
      />

      <DisplayCountries displayedCountries={displayedCountries} setDisplayedCountries={setDisplayedCountries} />

    </div>
  )

}

export default App;

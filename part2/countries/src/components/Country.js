import Weather from './Weather'

const Country = ({ countries, countryName }) => {
    const country = countries.find(c => c.name.common === countryName)
    console.log(country);
    console.log(country.languages);
  
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
  
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map(l => <li key={l}>{l}</li>)}
        </ul>
  
        <img src={country.flags.png} alt={`${country.name.common}'s flag`} />
  
        <Weather country={country} />
      </div>
    )
  }

  export default Country
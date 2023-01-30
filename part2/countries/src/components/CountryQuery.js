const CountryQuery = ({ query, setQuery, countries, setDisplayedCountries }) => {
    const handleQueryChange = (event) => {
      console.log(event.target);
      setQuery(event.target.value)
      setDisplayedCountries(countries.filter((country) =>
          country.name.common.toLowerCase().includes((event.target.value).toLowerCase())
        ))
    }
  
    return (
      <input value={query} onChange={handleQueryChange}></input>
    )
  }

export default CountryQuery
const Countries = ({ displayedCountries, setDisplayedCountries }) => {
    return (
      <ul>
          {displayedCountries.map(c => 
            <div key={c.name.common}><li>{c.name.common} 
            <button onClick={() => setDisplayedCountries([c])}>show</button></li></div>
          )}
      </ul>
    )
  }

export default Countries
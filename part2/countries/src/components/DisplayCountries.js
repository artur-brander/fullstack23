import Countries from "./Countries";
import Country from "./Country";

const DisplayCountries = ({ displayedCountries, setDisplayedCountries }) => {
    console.log('displayedCountries: ', displayedCountries);
    
    if(displayedCountries.length === 1) {
      return (
        <Country countries={displayedCountries} countryName={displayedCountries[0].name.common} />
      )
    } else if(displayedCountries.length > 10) {
      return (
        <p>Too many matches, specify another filter</p>
      )
    } else {
      return (
        <Countries displayedCountries={displayedCountries} setDisplayedCountries={setDisplayedCountries} />
      )
    }
  }

export default DisplayCountries
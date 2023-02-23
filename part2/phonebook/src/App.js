import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = ({ newFilter, setFilter }) => {
  const handleFilterChange = (event) => {
    console.log('Handling filter change', event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
        filter shown with
        <input value={newFilter} onChange={handleFilterChange} />
    </div>
  )
}

const Notification = ({ message }) => {
  if(message === null) { 
    return null 
  }

  return (
    <div className='notification'>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if(message === null) { 
    return null 
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const PersonForm = ({ newName, newNumber, persons, setNewName, setNewNumber, setPersons, setNotification, setError }) => {
  const addName = (event) => {
    event.preventDefault()
    console.log('Event target:', event.target, 'New name:', newName)

    const personObject = { name: newName, number: newNumber }
    if(!persons.every(p => p.name !== personObject.name)) {
      if (window.confirm(`${personObject.name} is already added to phonebook, replace old number with new one?`)) {
        const person = persons.find(p => p.name === personObject.name)
        const changedPerson = { ...person, number: newNumber }
        console.log('person:', person, 'changedPerson', changedPerson);
        
        personService
          .updateNumber(changedPerson.id, changedPerson)
          .then(updatedPerson => {
            setPersons(persons.map(p => p.id !== changedPerson.id ? p : updatedPerson))
          })

        setNotification(`Updated ${newName}'s number`)
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      }
      return
    }

    personService
      .create(personObject)
      .then(response => {
        console.log(`Server's response to POST /persons/ with this data`, response.data);
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setNotification(`Added ${newName}`)
        setTimeout(() => {
          setNotification(null)
        }, 3000)
      })
      .catch(error => {
        console.log(error.response.data.error);
        
        setError(`${error.response.data.error}`)
        setTimeout(() => {
          setError(null)
        }, 3000)
      })
  }

  const handleNumberChange = (event) => {
    console.log('Handling number change:', event.target.value)
    setNewNumber(event.target.value)
  }
  const handleNameChange = (event) => {
    console.log('Handling name change:', event.target.value)
    setNewName(event.target.value)
  }

  return (
    <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Person = ({ person }) => <>{person.name} {person.number}</>
const Persons = ({ filteredPersons, setPersons, setNotification, setError }) => {
  console.log('Persons Component filteredPersons: ', filteredPersons);
  return (
    filteredPersons.map(p => 
    <div key={p.name}>
      <Person person={p} /> 
      <DeleteButton id={p.id} persons={filteredPersons} setPersons={setPersons} 
                    setNotification={setNotification} setError={setError} />
    </div>)
  )
}

const DeleteButton = ({ id, persons, setPersons, setNotification, setError }) => {
  const person = persons.find(p => p.id === id)
  const deletePerson = (id) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(response => {
          console.log('Deleting a person', response);
          setNotification(`Deleted ${person.name}`)
          setTimeout(() => {
            setNotification(null)
          }, 3000)
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.log('Error occured while deleting: ', error);
          setError(`Information of ${person.name} has already been removed from the server`)
          setTimeout(() => {
            setError(null)
          }, 3000)
          setPersons(persons.filter(person => person.id !== id))
        })

    } else {
      return
    }
  }

  return (
    <button type="submit" onClick={() => deletePerson(id)}>delete</button>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    console.log('Effect started');
    
    personService
      .getAll()
      .then((response) => {
        console.log('Promise fulfilled');
        setPersons(response.data)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [newNotification, setNotification] = useState(null)
  const [newError, setError] = useState(null)

  const filteredPersons = persons.filter(p => p.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={newNotification} />
      <Error message={newError} />

      <Filter newFilter={newFilter} setFilter={setFilter} />

      <h3>add a new</h3>

      <PersonForm 
        newName={newName} newNumber={newNumber} persons={persons} 
        setNewName={setNewName} setNewNumber={setNewNumber} setPersons={setPersons}
        setNotification={setNotification} setError={setError}
      />

      <h2>Numbers</h2>
      
      <Persons 
        filteredPersons={filteredPersons} 
        setPersons={setPersons}
        setNotification={setNotification} 
        setError={setError}
      />
      
    </div>
  )
}

export default App
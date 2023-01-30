import { useState } from 'react'

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

const PersonForm = ({ newName, newNumber, persons, setNewName, setNewNumber, setPersons }) => {
  const addName = (event) => {
    event.preventDefault()
    console.log('Event target:', event.target, 'New name:', newName)

    const personObject = { name: newName, number: newNumber }
    if(!persons.every(p => p.name !== personObject.name)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPersons = persons.concat(personObject)
    console.log('New persons array:', newPersons);

    setPersons(newPersons)
    setNewName('')
    setNewNumber('')
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

const Persons = ({ filteredPersons }) => filteredPersons.map(p => <p key={p.name}>{p.name} {p.number}</p>)

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')

  const filteredPersons = persons.filter(p => p.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter newFilter={newFilter} setFilter={setFilter} />

      <h3>add a new</h3>

      <PersonForm 
        newName={newName} newNumber={newNumber} persons={persons} 
        setNewName={setNewName} setNewNumber={setNewNumber} setPersons={setPersons} 
      />

      <h2>Numbers</h2>
      
      <Persons filteredPersons={filteredPersons} />
    </div>
  )
}

export default App
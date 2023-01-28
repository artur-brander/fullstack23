import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const addName = (event) => {
    event.preventDefault()
    console.log('Event target:', event.target, 'New name:', newName)

    const nameObject = { name: newName }
    if(!persons.every(p => JSON.stringify(p) !== JSON.stringify(nameObject))) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const newPersons = persons.concat(nameObject)
    console.log('New persons array:', newPersons);


    setPersons(newPersons)
    setNewName('')
  }

  const handleNameChange = (event) => {
    console.log('Handling name change:', event.target.value)
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map(p => <p key={p.name}>{p.name}</p>)}
    </div>
  )
}

export default App
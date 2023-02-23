require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token("data", (req) => { return req.method === "POST" ? JSON.stringify(req.body) : null })
app.use(morgan(`:method :url :status :res[content-length] - :response-time ms :data`))

app.get('/', (request, response) => {
    response.send('<h1>Welcome to root!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/info', (request, response) => {
    const time = new Date()
    Person.find({}).then(people => {
        console.log(people.length)
        response.send(`<p>Phonebook has info for ${people.length} people</p><p>${time}</p>`)
    })

})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                console.log(person)
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    console.log(`sent content-type: ${request.get('content-type')}`)

    const body = request.body

    if(!body.name || !body.number) {
        return response.status(404).json({
            error: 'insert a proper name and number'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(() => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        response.json(person)
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    console.log('put started')
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    console.log(person)

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" })
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})
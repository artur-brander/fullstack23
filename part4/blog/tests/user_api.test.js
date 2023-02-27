const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)
const helper = require('./test_helper')


describe('initially one user in the db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secretus', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh user', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "palikka",
            name: "Johnson Mornson",
            password: 'johnson',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with a username that is taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "root",
            name: "Juurekas Porkkana",
            password: 'porkkana',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart).toEqual(usersAtEnd)
    })

    test('creation fails with a short password', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "pekka",
            password: "12",
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password needs to be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart).toEqual(usersAtEnd)
    })

    test('creation fails with a short username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "pe",
            password: "12345",
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain(`is shorter than the minimum allowed length (3)`)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart).toEqual(usersAtEnd)
    })

    test('creation fails with a missing password', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: "asd",
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password needs to be at least 3 characters long')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart).toEqual(usersAtEnd)
    })

    test('creation fails with a missing username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: "koppa",
            password: "lollero",
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` is required')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtStart).toEqual(usersAtEnd)
    })
})
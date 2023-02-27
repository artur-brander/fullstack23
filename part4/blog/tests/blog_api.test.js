const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const jwt = require("jsonwebtoken");
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')
const bcrypt = require('bcrypt')

beforeEach(async () => {
    await Blog.deleteMany({})
    console.log('cleared the test database')

    await Blog.insertMany(helper.initialBlogs)
    console.log('added initial blogs to test database')
})

describe('when there is initially some blogs saved', () => {
    test('GET request to /api/blogs returns the correct values in the correct format', async () => {
        const response = await api.get('/api/blogs')
        expect(response.header['content-type']).toContain('application/json')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('unique identifier property is named id not _id', async () => {
        const response = await api.get('/api/blogs')
        const blogId = response.body[0].id
        console.log('Blog IDs are defined as with the property id: ', blogId)
        expect(blogId).toBeDefined()
    })
})

describe('addition of new blogs', () => {
    let token = null

    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secretus', 10)
        const user = new User({ username: 'test', passwordHash })

        await user.save()

        const userForToken = {
            username: user.username,
            id: user.id,
        }
        token = jwt.sign(userForToken, process.env.SECRET)
    })

    test('POST request to /api/blogs creates a new blog to the database', async () => {
        const blog = {
            title: "Rock",
            author: "Coller Moller",
            url: "artur.fi",
            likes: 123
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    })

    test('creating a new blog post without likes defines the likes as 0', async () => {
        const blog = {
            title: "Rock",
            author: "Coller Moller",
            url: "artur.fi",
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
    })

    test('missing title or url property leads to status 400', async () => {
        const missingTitleBlog = {
            author: "Coller Moller",
            url: "Saanko.fi"
        }

        const missingUrlBlog = {
            title: "Rock",
            author: "Coller Moller"
        }

        await api
            .post('/api/blogs')
            .send(missingTitleBlog)
            .expect(400)

        await api
            .post('/api/blogs')
            .send(missingUrlBlog)
            .expect(400)
    })
})

describe('deletion of a blog', () => {
    let token = null

    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const passwordHash = await bcrypt.hash('secretus', 10)
        const user = new User({ username: 'test', passwordHash })

        await user.save()

        const userForToken = {
            username: user.username,
            id: user.id,
        }
        token = jwt.sign(userForToken, process.env.SECRET)

        const blog = {
            title: "Rock",
            author: "Coller Moller",
            url: "artur.fi",
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })

    test('succeeds with status 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        console.log(blogToDelete.id)

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(0)

        const ids = blogsAtEnd.map(blog => blog.id)
        expect(ids).not.toContain(blogToDelete.id)
    })
})

describe('updating properties of a blog', () => {
    test('succeeds with status 200 if PUT request was successful', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send({ likes: 69 })
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0].likes).toBe(69)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
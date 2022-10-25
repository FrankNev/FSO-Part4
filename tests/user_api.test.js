const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
   await User.deleteMany({})

   const passwordHash = await bcrypt.hash('sekretpass', 10)
   const user = new User({ username: 'root', passwordHash })

   await user.save()
})


describe('While adding a new user to the db', () => {
   test('succeeds with a valid info on the request', async () => {
      const usersAtStart = await helper.getUsersInDb()

      const newUser = {
         username: 'Frank123',
         name: 'Franco Neville',
         password: 'mypassword'
      }

      await api
         .post('/api/users')
         .send(newUser)
         .expect(200)
         .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.getUsersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
   })
})

describe('error ocurrs when', () => {
   test('username isnt unique', async () => {
      const newUser = {
         username: 'root',
         name: 'Superuser',
         password: 'Securepassword',
      }

      await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
   })

   test('password is invalid', async () => {
      const newUser = {
         username: 'Leon',
         name: 'Leon S. Kennedy',
         password: 'RE4',
      }

      await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
   })

   test('username is invalid', async () => {
      const newUser = {
         username: 'Amy',
         name: 'Amy Anderson',
         password: 'S3cur3P4ssW0rd-',
      }

      await api
         .post('/api/users')
         .send(newUser)
         .expect(400)
   })
})

afterAll(() => {
   mongoose.connection.close()
})
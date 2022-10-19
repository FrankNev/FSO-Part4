const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)


beforeEach(async () => {
   await Blog.deleteMany({})
   await Blog.insertMany(helper.listOfBlogs)
})

describe('While testing the api', () => {
   test('the blogs list is returned as json', async () => {
      await api
         .get('/api/blogs')
         .expect(200)
         .expect('Content-Type', /application\/json/)
   })

   test('all the blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body.length).toBe(helper.listOfBlogs.length)
   })

   test('the _id property is defined as id', async () => {
      const response = await api.get('/api/blogs')
      const blogInfo = response.body.map(blog => blog.id)
      expect(blogInfo).toBeDefined()
   })
})

describe('When the request is valid', () => {
   test('a blog is correctly added to the database', async () => {
      const newBlog = {
         title: '20 programming games to level up your programming skills',
         author: 'Thomas De Moor',
         url: 'https://x-team.com/blog/coding-games/',
         likes: 13
      }

      await api
         .post('/api/blogs')
         .send(newBlog)
         .expect(200)
         .expect('Content-Type', /application\/json/)

      const result = await helper.getBlogsInDb()
      expect(result).toHaveLength(helper.listOfBlogs.length + 1)

      const blogTitles = result.map(blog => blog.title)
      expect(blogTitles).toContain('20 programming games to level up your programming skills')
   })

   test('if it doesnt have the likes property, the default value is 0', async () => {
      const newBlog = {
         title: 'Step by step guide to becoming a modern Node.js developer in 2022',
         author: 'Kamran Ahmed',
         url: 'https://roadmap.sh/nodejs'
      }

      await api
         .post('/api/blogs')
         .send(newBlog)
         .expect(200)
         .expect('Content-Type', /application\/json/)

      const result = await helper.getBlogsInDb()
      expect(result).toHaveLength(helper.listOfBlogs.length + 1)

      const likesCheck = result.every(obj => Object.prototype.hasOwnProperty.call(obj, 'likes'))
      expect(likesCheck).toBe(true)
   })

   test('the likes of a blog can be updated', async () => {
      const updateRequest = {
         id: '5a422ba71b54a676234d17fb',
         title: 'TDD harms architecture',
         likes: 6
      }

      const response = await api.put(`/api/blogs/${ updateRequest.id }`).send(updateRequest)
      expect(response.status).toBe(200)

      const result = await helper.getBlogsInDb()
      const updatedBlog = result.find(blog => {
         if( blog.id === updateRequest.id ) {
            return blog
         }
      })
      expect(updatedBlog).toEqual({
         id: '5a422ba71b54a676234d17fb',
         title: 'TDD harms architecture',
         author: 'Robert C. Martin',
         url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
         likes: 6
      })
   })

   test('a blog can be deleted', async () => {
      const blogToRemove = {
         id: '634f460a376f6df17808fe93',
         title: 'Step by step guide to becoming a modern Node.js developer in 2022',
      }

      await api
         .delete(`/api/blogs/${ blogToRemove.id }`)
         .expect(204)

      const result = await helper.getBlogsInDb()
      expect(result.length).toBe(helper.listOfBlogs.length)
   })
})

describe('Error occurs when trying to', () => {
   test('add an invalid blog with missing content', async () => {
      const newBlog = {
         author: 'Some One',
         likes: 7
      }

      await api
         .post('/api/blogs')
         .send(newBlog)
         .expect(400)
   })
})


afterAll(() => {
   mongoose.connection.close()
})
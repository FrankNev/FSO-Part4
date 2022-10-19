const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')


describe('totalLikes', () => {
   test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(helper.listOfBlogs)
      expect(result).toBe(37)
   })
})

describe('favoriteBlog', () => {
   test('this is the favorite blog on the list', () => {
      const result = listHelper.favoriteBlog(helper.listOfBlogs)
      expect(result).toEqual({
         title: 'Canonical string reduction',
         author: 'Edsger W. Dijkstra',
         likes: 12
      })
   })
})

describe('mostBlogs', () => {
   test('this is the autor with most blogs posted', () => {
      const result = listHelper.mostBlogs(helper.listOfAuthors)
      expect(result).toEqual({
         author: 'Robert C. Martin',
         posts: 3
      })
   })
})

describe('mostLikes', () => {
   test('this is the most liked author', () => {
      const result = listHelper.mostLikes(helper.listOfBlogs)
      expect(result).toEqual({
         author: 'Edsger W. Dijkstra',
         likes: 17
      })
   })
})
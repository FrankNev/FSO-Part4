const totalLikes = (blogs) => {
   let totalLikes = 0

   for (let blog in blogs) {
      let likes = blogs[blog].likes
      totalLikes += likes
   }

   return totalLikes
}


const favoriteBlog = (blogsList) => {
   let blogs = blogsList.map(blog => {
      delete blog.url
      delete blog.__v
      delete blog._id

      return blog
   })

   let mostLikedBlog = {}
   let likesAmount = 0

   for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].likes > likesAmount) {
         mostLikedBlog = blogs[i]
         likesAmount = blogs[i].likes
      }
   }

   return mostLikedBlog
}

const mostBlogs = (authors) => {
   let topAuthor = {}
   let numOfPosts = 0

   for (let i = 0; i < authors.length; i++) {
      if (authors[i].posts > numOfPosts) {
         topAuthor = authors[i]
         numOfPosts = authors[i].posts
      }
   }

   return topAuthor
}

const mostLikes = (blogsList) => {
   let blogs = blogsList.map(blog => {
      delete blog.url
      delete blog.__v
      delete blog._id
      delete blog.title

      return blog
   })

   let likesAmount = 0
   let topAuthor = { author: '', likes: 0 }

   for (let i = 0; i < blogs.length; i++) {
      if (blogs[i].likes > likesAmount) {
         topAuthor.author = blogs[i].author
         likesAmount = blogs[i].likes
      }
   }

   topAuthor.likes = blogs.reduce((likes, blog) => {
      if (blog.author === topAuthor.author) {
         likes += blog.likes
      }
      return likes
   }, 0)

   return topAuthor
}

module.exports = {
   totalLikes,
   favoriteBlog,
   mostBlogs,
   mostLikes
}
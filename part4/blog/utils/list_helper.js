const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce(
        (accumulator, currentValue) => accumulator + currentValue.likes,
        0,
    )
}

const favoriteBlog = (blogs) => {
    const topLikes = blogs.reduce((a, b) => Math.max(a, b.likes), null)
    return blogs.find(blog => blog.likes === topLikes)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) { return undefined }

    const blogCountByAuthor = lodash.countBy(blogs, "author")
    const maxAuthor = Object.keys(blogCountByAuthor).reduce((a, b) => {
        return blogCountByAuthor[a] > blogCountByAuthor[b] ? a : b
    })

    return {
        author: maxAuthor,
        blogs: blogCountByAuthor[maxAuthor],
    }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) { return undefined }

  const likesByAuthor = lodash(blogs).groupBy("author")
        .map((objects, author) => ({
            author: author,
            likes: lodash.sumBy(objects, "likes"),
        }))

  return likesByAuthor.value().reduce((a, b) => {
        return a.likes > b.likes ? a : b;
  })
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
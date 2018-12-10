const express = require('express')
const posts = express.Router()

const postsCtrl = require('./posts.ctrl')
const commentsCtrl = require('./comments.ctrl')
const likesCtrl = require('./likes.ctrl')

posts.post('/', postsCtrl.write)
posts.get('/', postsCtrl.list)
posts.get('/:postId', postsCtrl.getPost)
posts.post('/:postId/likes', likesCtrl.like)
posts.delete('/:postId/likes', likesCtrl.dislike)
posts.post('/:postId/comments', commentsCtrl.comments)
posts.patch('/:postId/update', postsCtrl.update)
posts.post('/:postId/delete', postsCtrl.delete)
posts.get('/search/:title', postsCtrl.search)

module.exports = posts
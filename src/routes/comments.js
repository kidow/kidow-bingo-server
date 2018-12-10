const Joi = require('joi')
const Post = require('../models/post')
const { Types: { ObjectId }} = require('mongoose')
const express = require('express')

const comments = express()

comments.post('/:postId/comments', async (req, res) => {
  const { user } = req
  if (!user) {
    res.sendStatus(403)
    return
  }

  const schema = Joi.object().keys({
    text: Joi.string().min(1).max(100).required()
  })

  const result = Joi.validate(req.body, schema)
  if (result.error) {
    res.sendStatus(400)
    console.log(result.error)
    return
  }

  const { username } = user
  const { text } = req.body
  const { postId } = req.params

  if (!ObjectId.isValid(postId)) {
    res.sendStatus(400)
    return
  }

  let post = null
  try {
    post = await Post.findById(postId)
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  if (!post) {
    res.sendStatus(404)
    return
  }

  try {
    await post.writeComment({username, text})
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.json(post.comments)
})

module.exports = comments
const User = require('../models/user')
const Post = require('../models/post')
const Joi = require('joi')
const { Types: { ObjectId }} = require('mongoose')
const express = require('express')

const posts = express.Router()

posts.post('/', async (req, res) => {
  if (!req.user) {
    res.status(403)
    res.json({ message: 'not logged in' })
    return
  }

  let user
  try {
    user = await User.findById(req.user._id).exec()
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  if (!user) {
    res.sendStatus(403)
    return
  }

  const schema = Joi.object().keys({
    title: Joi.string().max(20).required(),
    description: Joi.string().max(20),
    oneBingo: Joi.string().max(20).required(),
    twoBingo: Joi.string().max(20).required(),
    threeBingo: Joi.string().max(20).required(),
    cell_1_1: Joi.string().max(25).required(),
    cell_1_2: Joi.string().max(25).required(),
    cell_1_3: Joi.string().max(25).required(),
    cell_1_4: Joi.string().max(25).required(),
    cell_1_5: Joi.string().max(25).required(),
    cell_2_1: Joi.string().max(25).required(),
    cell_2_2: Joi.string().max(25).required(),
    cell_2_3: Joi.string().max(25).required(),
    cell_2_4: Joi.string().max(25).required(),
    cell_2_5: Joi.string().max(25).required(),
    cell_3_1: Joi.string().max(25).required(),
    cell_3_2: Joi.string().max(25).required(),
    cell_3_3: Joi.string().max(25).required(),
    cell_3_4: Joi.string().max(25).required(),
    cell_3_5: Joi.string().max(25).required(),
    cell_4_1: Joi.string().max(25).required(),
    cell_4_2: Joi.string().max(25).required(),
    cell_4_3: Joi.string().max(25).required(),
    cell_4_4: Joi.string().max(25).required(),
    cell_4_5: Joi.string().max(25).required(),
    cell_5_1: Joi.string().max(25).required(),
    cell_5_2: Joi.string().max(25).required(),
    cell_5_3: Joi.string().max(25).required(),
    cell_5_4: Joi.string().max(25).required(),
    cell_5_5: Joi.string().max(25).required(),
  })

  const result = Joi.validate(req.body, schema)

  if (result.error) {
    res.sendStatus(400)
    return
  }

  let post
  try {
    post = await Post.write(req.body)
    await user.increaseCount()
  } catch (e) {
    console.error(e)
    res.status(500)
  }
  
  post = post.toJSON()
  delete post.likes
  post.liked = false

  res.json(post)
})

posts.get('/', async (req, res) => {

})

module.exports = posts
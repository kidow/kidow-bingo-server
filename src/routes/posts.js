const User = require('../models/user')
const Post = require('../models/post')
const Joi = require('joi')
const { Types: { ObjectId }} = require('mongoose')
const express = require('express')

const posts = express.Router()

posts.post('/', async (req, res) => {
  const { user } = req

  if (!user) {
    res.status(403)
    res.json({ message: 'not logged in' })
    return
  }

  let account
  try {
    account = await User.findById(user._id).exec()
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  if (!account) {
    res.sendStatus(403)
    return
  }

  const schema = Joi.object().keys({

  })

  const result = Joi.validate(req.body, schema)

  
})

posts.get('/', async (req, res) => {

})

module.exports = posts
const express = require('express')
const Joi = require('joi')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const users = express.Router()

users.post('/logout', (req, res) => {
  res.clearCookie('access_token')
  res.sendStatus(204)
})

users.get('/check', (req, res) => {
  const { user } = req
  if (!user) {
    res.sendStatus(403)
    return
  }
  res.json(user)
})

users.patch('/change/username', async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().min(3).max(10).required()
  })

  const result = Joi.validate(req.body, schema)

  if (result.error) {
    res.sendStatus(400)
    return
  }

  const { username } = req.body

  let exists = null
  try {
    exists = await User.findByUsername(username)
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  if (exists) {
    res.status(409)
    res.json(exists)
    return
  }

  let user = null
  try {
    user = await User.findOneAndUpdate({ _id: req.user._id }, { username }, { new: true })
    req.user.username = username
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  let token = null
  try {
    token = await user.generateToken()
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.cookie('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
  res.json(username)
})

users.patch('/change/password', async (req, res) => {
  const schema = Joi.object().keys({
    password: Joi.string().min(6).required()
  })

  const result = Joi.validate(req.body, schema)

  if (result.error) {
    res.sendStatus(400)
    return
  }

  const { password } = req.body
  const { _id } = req.user

  let user = null
  let hash = bcrypt.hashSync(password, 12)
  try {
    user = await User.findOneAndUpdate({ _id }, { password: hash })
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  let token = null
  try {
    token = await user.generateToken()
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.cookie('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
  res.json(hash)
})

users.post('/leave', async (req, res) => {
  const schema = Joi.object().keys({
    password: Joi.string().min(6).required()
  })

  const result = Joi.validate(req.body, schema)

  if (result.error) {
    res.sendStatus(400)
    console.log(result.error)
    return
  }

  const { _id } = req.user
  const { password } = req.body

  let user = null
  try {
    user = await User.findOne({ _id })
    if (!user || !user.validatePassword(password)) {
      res.sendStatus(400)
      return
    } else {
      await User.findOneAndDelete({ _id })
    }
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.clearCookie('access_token')
  res.sendStatus(204)
})

module.exports = users
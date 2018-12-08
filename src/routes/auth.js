const express = require('express')
const Joi = require('joi')
const User = require('../models/user')

const auth = express.Router()

auth.post('/register/local', async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })

  const result = Joi.validate(req.body, schema)

  if (result.error) {
    res.sendStatus(400)
    return
  }

  let existing = null
  try {
    existing = await User.findByEmailOrUsername(req.body)
  } catch (e) {
    console.error(e)
    res.status(e)
  }

  if (existing) {
    res.status(409)
    res.json({ key: existing.email === req.body.email ? 'email' : 'password' })
    return
  }

  let user = null
  try {
    user = await User.localRegister(req.body)
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
  res.json(user)
})

auth.post('/login/local', async (req, res) => {
  const schema = Joi.object().keys({
    username: Joi.string().min(3).max(10).required(),
    password: Joi.string().required()
  })

  const result = Joi.validate(req.body, schema)

  if (result.error) {
    res.sendStatus(400)
    return
  }

  const { username, password } = req.body

  let user = null
  try {
    user = await User.findByUsername(username)
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  if (!user || !user.validatePassword(password)) {
    res.sendStatus(403)
    return
  }

  let token = null
  try {
    token = await user.generateToken()
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.cookie('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
  res.json(user)
})

auth.get('/exists/:key(email|username)/:value', async (req, res) => {
  const { key, value } = req.params

  let user = null
  try {
    user = await (key === 'email' ? User.findByEmail(value) : User.findByUsername(value))
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.json({ exists: user !== null })
})

auth.post('/logout', (req, res) => {
  res.clearCookie('access_token')
  res.sendStatus(204)
})

auth.get('/check', (req, res) => {
  const { user } = req
  if (!user) {
    res.sendStatus(403)
    return
  }
  res.json(user)
})

auth.patch('/change/username', async (req, res) => {
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
    user = await User.findById(req.user._id)
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  console.log('req.user :', req.user)
  console.log('user :', user)

  res.json(user)
})

auth.patch('/change/password', async (req, res) => {
  const { password } = req.body
  res.json({message: 'not yet.'})
})

auth.delete('/leave', async (req, res) => {
  const { password } = req.body
  res.json({ message: 'not yet.' })
})

module.exports = auth
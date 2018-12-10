const express = require('express')
const users = express.Router()

const usersCtrl = require('./users.ctrl')

users.post('/logout', usersCtrl.logout)
users.get('/check', usersCtrl.check)
users.patch('/change/username', usersCtrl.changeUsername)
users.patch('/change/password', usersCtrl.changePassword)
users.post('/leave', usersCtrl.leave)

module.exports = users
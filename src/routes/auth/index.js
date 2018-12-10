const express = require('express')
const auth = express.Router()

const authCtrl = require('./auth.ctrl')

auth.post('/register/local', authCtrl.localRegister)
auth.post('/login/local', authCtrl.localLogin)
auth.get('/exists/:key(email|username)/:value', authCtrl.exists)

module.exports = auth
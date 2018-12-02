const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const User = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String }
}, { 
  timestamps: true 
})

module.exports = mongoose.model('User', User)
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { generateToken } = require('../lib/token')

function hash(password) {
  return bcrypt.hashSync(password, 12)
}

const User = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  count: { type: Number, default: 0 }
}, { 
  timestamps: true 
})

User.statics.findByUsername = function(username) {
  return this.findOne({username}).exec()
}

User.statics.findByEmail = function(email) {
  return this.findOne({email}).exec()
}

User.statics.findByEmailOrUsername = function({username, email}) {
  return this.findOne({$or: [{username}, {email}]}).exec()
}

User.statics.localRegister = function({username, email, password}) {
  const user = new this({
    username,
    email,
    password: hash(password)
  })
  
  return user.save()
}

User.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

User.methods.generateToken = function() {
  const payload = {
    _id: this._id,
    username: this.username
  }

  return generateToken(payload, 'user')
}

User.methods.hashPassword = function(password) {
  return bcrypt.hashSync(password, 12)
}

module.exports = mongoose.model('User', User)
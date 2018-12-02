const mongoose = require('mongoose')

const Comment = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  username: String,
  text: String
})

const Post = new mongoose.Schema({
  username: String,
  comments: {
    type: [Comment],
    default: []
  }
}, { 
  timestamps: true
})

module.exports = mongoose.model('Post', Post)

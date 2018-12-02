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

Post.statics.write = function({}) {
  const post = new this({})
  return post.save()
}

Post.statics.list = function({}) {
  
}

Post.methods.writeComment = function({username, text}) {
  this.comments.unshift({username, text})
  return this.save()
}

module.exports = mongoose.model('Post', Post)

const mongoose = require('mongoose')

const Comment = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  username: String,
  text: String
})

const Post = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  comments: {
    type: [Comment],
    default: []
  },
  title: String,
  description: String,
  oneBingo: String,
  twoBingo: String,
  threeBingo: String,
  likesCount: { type: Number, default: 0 },
  likes: { type: [String], default: [] },
  count: String,
  cell_1_1: String,
  cell_1_2: String,
  cell_1_3: String,
  cell_1_4: String,
  cell_1_5: String,
  cell_2_1: String,
  cell_2_2: String,
  cell_2_3: String,
  cell_2_4: String,
  cell_2_5: String,
  cell_3_1: String,
  cell_3_2: String,
  cell_3_3: String,
  cell_3_4: String,
  cell_3_5: String,
  cell_4_1: String,
  cell_4_2: String,
  cell_4_3: String,
  cell_4_4: String,
  cell_4_5: String,
  cell_5_1: String,
  cell_5_2: String,
  cell_5_3: String,
  cell_5_4: String,
  cell_5_5: String
})

Post.statics.write = function({...rest}) {
  const post = new this({...rest})
  return post.save()
}

Post.statics.list = function({}) {
  
}

Post.methods.writeComment = function({username, text}) {
  this.comments.unshift({username, text})
  return this.save()
}

module.exports = mongoose.model('Post', Post)

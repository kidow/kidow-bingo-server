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
  username: String,
  title: String,
  description: String,
  oneBingo: String,
  twoBingo: String,
  threeBingo: String,
  likesCount: { type: Number, default: 0 },
  likes: { type: [String], default: [] },
  count: String,
  titleImage: String,
  bingo: Object
})

Post.statics.write = function({username, ...rest}) {
  const post = new this({username, ...rest})
  return post.save()
}

Post.statics.list = function ({cursor, username, self}) {
  const query = Object.assign({},
    cursor ? { _id: { $lt: cursor } } : {},
    username ? { username } : {}
  )

  const projection = self ? {
    count: 1,
    title: 1,
    description: 1,
    comments: 1,
    likes: {
      '$elemMatch': { '$eq': self }
    },
    likesCount: 1,
    createdAt: 1
  } : {}
  return this.find(query, projection).sort({ _id: -1 }).limit(8).exec()
}

Post.methods.writeComment = function({username, text}) {
  this.comments.unshift({username, text})
  return this.save()
}

Post.statics.like = function ({ _id, username }) {
  return this.findByIdAndUpdate(_id, {
    $inc: { likesCount: 1 },
    $push: { likes: username }
  }, {
      new: true,
      select: 'likesCount'
    }).exec()
}

Post.statics.dislike = function ({ _id, username }) {
  return this.findByIdAndUpdate(_id, {
    $inc: { likesCount: -1 },
    $pull: { likes: username }
  }, {
      new: true,
      select: 'likesCount'
    })
}

module.exports = mongoose.model('Post', Post)

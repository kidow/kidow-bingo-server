const User = require('../../models/user')
const Post = require('../../models/post')
const Joi = require('joi')
const { Types: { ObjectId } } = require('mongoose')

exports.write = async (req, res) => {
  if (!req.user) {
    res.status(403)
    res.json({ message: 'not logged in' })
    return
  }

  let user
  try {
    user = await User.findById(req.user._id).exec()
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  if (!user) {
    res.sendStatus(403)
    return
  }

  const schema = Joi.object().keys({
    title: Joi.string().max(20).required(),
    description: Joi.string().max(20).empty(''),
    oneBingo: Joi.string().max(20).required(),
    twoBingo: Joi.string().max(20).required(),
    threeBingo: Joi.string().max(20).required(),
    bingo: Joi.object().keys({
      cell11: Joi.string().max(30).required(),
      cell12: Joi.string().max(30).required(),
      cell13: Joi.string().max(30).required(),
      cell14: Joi.string().max(30).required(),
      cell15: Joi.string().max(30).required(),
      cell21: Joi.string().max(30).required(),
      cell22: Joi.string().max(30).required(),
      cell23: Joi.string().max(30).required(),
      cell24: Joi.string().max(30).required(),
      cell25: Joi.string().max(30).required(),
      cell31: Joi.string().max(30).required(),
      cell32: Joi.string().max(30).required(),
      cell33: Joi.string().max(30).required(),
      cell34: Joi.string().max(30).required(),
      cell35: Joi.string().max(30).required(),
      cell41: Joi.string().max(30).required(),
      cell42: Joi.string().max(30).required(),
      cell43: Joi.string().max(30).required(),
      cell44: Joi.string().max(30).required(),
      cell45: Joi.string().max(30).required(),
      cell51: Joi.string().max(30).required(),
      cell52: Joi.string().max(30).required(),
      cell53: Joi.string().max(30).required(),
      cell54: Joi.string().max(30).required(),
      cell55: Joi.string().max(30).required()
    }).required()
  })

  const result = Joi.validate(req.body, schema)

  if (result.error) {
    res.sendStatus(400)
    console.log(result.error)
    return
  }

  let post
  try {
    post = await Post.write({
      username: req.user.username,
      ...req.body
    })
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  post = post.toJSON()
  delete post.likes
  post.liked = false

  res.json(post)
}

exports.list = async (req, res) => {
  const { cursor, username } = req.query

  if (cursor && !ObjectId.isValid(cursor)) {
    res.sendStatus(400)
    return
  }

  const { user } = req
  const self = user ? user.username : null

  let posts = null
  try {
    posts = await Post.list({ cursor, username, self })
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  const next = posts.length === 8 ? `/posts/?${username ? `username=${username}&` : ''}cursor=${posts[7]._id}` : null

  function checkLiked(post) {
    post = post.toObject()

    const checked = Object.assign(post, { liked: user !== null && post.likes.length > 0 })
    delete checked.likes
    return checked
  }

  posts = posts.map(checkLiked)

  res.json({
    next,
    data: posts
  })
}

exports.getPost = async (req, res) => {
  const { postId } = req.params

  if (!ObjectId.isValid(postId)) {
    res.sendStatus(400)
    return
  }

  let post = null
  try {
    post = await Post.findById(postId)
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.json(post)
}

exports.update = async (req, res) => {
  const { postId } = req.params
}

exports.delete = async (req, res) => {
  const { postId } = req.params
  const { username } = req.user

  if (!ObjectId.isValid(postId)) {
    res.sendStatus(400)
    return
  }

  let post = null
  try {
    post = await Post.findById(postId)
    if (post.username !== username) {
      res.sendStatus(401)
      return
    } else {
      await Post.findByIdAndDelete(postId)
    }
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.json({ message: '성공적으로 삭제되었습니다' })
}

exports.search = async (req, res) => {
  const { title } = req.params

  let posts = null
  try {
    posts = await Post.find({ title: new RegExp(title) })
                      .sort({ title: 1 })
                      .limit(8)
                      .exec()
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.json({
    data: posts
  })
}
const User = require('../models/user')
const Post = require('../models/post')
const Joi = require('joi')
const { Types: { ObjectId }} = require('mongoose')
const express = require('express')
// const multer = require('multer')
// const fs = require('fs')

const posts = express.Router()

// fs.readdir('uploads', (error) => {
//   if (error) {
//     console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
//     fs.mkdirSync('uploads');
//   }
// });

// const upload = multer({
//   storage: multer.diskStorage({
//     destination(req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename(req, file, cb) {
//       const ext = path.extname(file.originalname);
//       cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
//     },
//   }),
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

posts.post('/', async (req, res) => {
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
    description: Joi.string().max(20),
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
})

posts.get('/', async (req, res) => {
  const { cursor, username } = req.query

  if (cursor && !ObjectId.isValid(cursor)) {
    res.sendStatus(400)
    return
  }

  const { user } = req
  const self = user ? user.username : null

  let posts = null
  try {
    posts = await Post.list({cursor, username, self})
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  const next = posts.length === 8 ? `/api/posts/?${username ? `username=${username}&` : ''}cursor=${posts[7]._id}` : null

  function checkLiked(post) {
    post = post.toObject()

    const checked = Object.assign(post, { liked: user !== null && post.likes.length > 0} )
    delete checked.likes
    return checked
  }

  posts = posts.map(checkLiked)

  res.json({
    next,
    data: posts
  })
})

posts.get('/:postId', async (req, res) => {
  const { postId } = req.params

  let post = null
  try {
    post = await Post.findById(postId)
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.json(post)
})

posts.post('/:postId/likes', async (req, res) => {
  const { user } = req
  if (!user) {
    res.sendStatus(403)
    return
  }

  const { postId } = req.params
  const { username } = user.profile

  let post = null
  try {
    post = await Post.findById(postId, {
      likesCount: 1,
      likes: {
        '$elemMatch': { '$eq': username }
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  if (!post) {
    res.sendStatus(404)
    return
  }

  if (post.likes[0] === username) {
    res.json({
      liked: true,
      likesCount: post.likesCount
    })
    return
  }

  try {
    post = await Post.like({
      _id: postId,
      username: username
    })
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.json({
    liked: true,
    likesCount: post.likesCount
  })
})

posts.delete('/:postId/likes', async (req, res) => {
  const { user } = req
  if (!user) {
    res.sendStatus(403)
    return
  }

  const { postId } = req.params
  const { username } = user.profile

  let post = null
  try {
    post = await Post.findById(postId, {
      likesCount: 1,
      likes: {
        '$elemMatch': { '$eq': username }
      }
    })
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  if (!post) {
    res.sendStatus(404)
    return
  }

  if (post.likes.length === 0) {
    res.json({
      liked: false,
      likesCount: post.likesCount
    })
    return
  }

  try {
    post = await Post.dislike({
      _id: postId,
      username: username
    })
  } catch (e) {
    console.error(e)
    res.status(500)
  }

  res.json({
    liked: false,
    likesCount: post.likesCount
  })
})

module.exports = posts
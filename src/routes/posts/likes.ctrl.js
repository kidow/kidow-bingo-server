const Post = require('../../models/post')
const { Types: { ObjectId }} = require('mongoose')

exports.like = async (req, res) => {
  const { user } = req
  if (!user) {
    res.sendStatus(403)
    return
  }

  const { postId } = req.params
  const { username } = user

  if (!ObjectId.isValid(postId)) {
    res.sendStatus(400)
    return
  }

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
}

exports.dislike = async (req, res) => {
  const { user } = req
  if (!user) {
    res.sendStatus(403)
    return
  }

  const { postId } = req.params
  const { username } = user

  if (!ObjectId.isValid(postId)) {
    res.sendStatus(400)
    return
  }

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
}
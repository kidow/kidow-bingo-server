require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const { jwtMiddleware } = require('./lib/token')
const path = require('path')
const port = process.env.PORT || 4000

const authRouter = require('./routes/auth')
const postsRouter= require('./routes/posts')
const usersRouter = require('./routes/users')

const app = express()

mongoose.Promise = Promise
mongoose.connect(process.env.MONGO_URI, { 
  dbName: 'kidow-bingo', 
  useNewUrlParser: true, 
  useCreateIndex: true
}, err => {
  if (err) {
    console.log('mongodb connection error :', err)
  } else {
    console.log('mongodb connected.')
  }
})

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(jwtMiddleware)

app.use('/auth', authRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)

app.listen(port, () => {
  console.log('App listening on port ' + port);
});
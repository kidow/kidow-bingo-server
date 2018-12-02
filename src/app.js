require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 4000

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

app.listen(port, () => {
  console.log('App listening on port ' + port);
});
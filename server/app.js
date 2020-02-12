const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()


const router = require('./router/router.js')

app.use(bodyParser.urlencoded({ extended: false, limit: '20000kb'}))
app.use(bodyParser.json({"limit": "20000kb"}))

app.use(express.static('che'))

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000*90*4}
}))

app.use(router)




app.listen(6060, function(){
    console.log('server is running at 6060...')
})
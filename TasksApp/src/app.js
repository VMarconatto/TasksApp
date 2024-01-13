require('./db/moongose.js')
const express = require('express')
const app = express()

const routeuser = require('./routes/routeuser.js')
const routetask = require('../src/routes/routetask.js')


app.use(express.json())
app.use(routeuser)
app.use(routetask)


module.exports = app

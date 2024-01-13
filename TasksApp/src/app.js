require('./db/moongose.js')
const express = require('express')
const app = express()
const routeuser = require('./routes/routeuser.js')
const routetask = require('../src/routes/routetask.js')
const jwt = require('jsonwebtoken')

app.use(express.json())
app.use(routeuser)
app.use(routetask)


module.exports = app
// const multer = require('multer')
// const upload = multer({
//     dest:'img'
// })

// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// })
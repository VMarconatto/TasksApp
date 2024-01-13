const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.connectionstring,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('Connection to MongoDB Sucesseful')
})
.catch((e)=>{
    console.log('Please, Check Connection String and Parameters')
    console.log(e)
})
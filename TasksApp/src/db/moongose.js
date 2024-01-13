const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.connectionstring,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('Connection to MongoDB Sucesseful')
})
.catch((e)=>{
    console.log('Alguma coisa deu errada')
    console.log(e)
})
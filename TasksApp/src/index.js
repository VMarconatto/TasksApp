const mongoose = require('./db/moongose.js')
const app = require('./app.js')
const port = process.env.PORT

app.listen(port,()=>{
    console.log(`Comunicando pela porta ${port}`)
})



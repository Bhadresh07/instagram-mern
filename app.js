const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000
const {MONGOURI} = require('./config/keys.js')
const mongoose = require('mongoose')

mongoose.connect(MONGOURI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
mongoose.connection.on('connected',()=>{
  console.log('connected to mongodb')
})
mongoose.connection.on('error',(err)=>{
  console.log('error is',err)
})

require('./models/user')
require('./models/post')
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if(process.env.NODE_ENV=="production"){
  app.use(express.static('client/build'))
  const path = require('path')
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

app.listen(PORT,()=>
{
  console.log('listening on port 8000')  
})

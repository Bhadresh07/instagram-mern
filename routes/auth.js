//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

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = mongoose.model("User")
const jwt = require('jsonwebtoken')
const {JWT_Secret} = require('../config/keys.js')
const requireLogin = require('../middleWare/requireLogin')

router.get('/',(req,res)=>{
    res.send('hello')
})

router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body

    if(!name||!email||!password)
    {
       return res.status(422).json({error:"Please add all the fields"}) 
    }
    User.findOne({email:email})
    .then((savedUser)=>
    {
      if(savedUser)
      {
        res.status(422).json({error:"user already exist with that email"}) 
      }
      else
      {
       bcrypt.hash(password,12)
       .then(hashedPassword=>{
            const user = new User({
            email,
            name,
            password:hashedPassword,
            pic
        })
        user.save()
        .then(
                res.json({message:"saved successfully"})
             )
            .catch(err=>{
                console.log(err)
        })
        .catch(err=>{
            console.log(err)
        })
     })   
     }
    })
    .catch(
      err=>{
         console.log(err)  
    })
})

router.post('/signin',(req,res)=>{
    const{email,password} = req.body

     User.findOne({email:email})
     .then(savedUser=>{
         if(!savedUser)
         {
            return res.status(422).json({error:"Invalid email or password"}) 
         }

         bcrypt.compare(password,savedUser.password)
         .then(doMatch=>{
             if(!doMatch)
             {
               return res.status(422).json({error:"Invalid email or password"})  
             }
             else
             {
               const token = jwt.sign({_id:savedUser._id},JWT_Secret)
               const {_id,name,email,followers,following,pic} = savedUser
               res.json({token,user:{_id,name,email,followers,following,pic}})
             }
         })
     })
     .catch(err=>{
         console.log(err)
     })
})

module.exports = router
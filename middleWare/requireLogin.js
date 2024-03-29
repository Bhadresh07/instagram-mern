const jwt = require('jsonwebtoken')
const {JWT_Secret} =require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT_Secret,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in"})
        }
        const {_id} = payload
        User.findById(_id).then(userdata=>{
           req.user = userdata
           next()
        })
    })
}

//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
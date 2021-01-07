 const express = require('express')
 const router = express.Router()
 const mongoose = require('mongoose')
 const requireLogin = require('../middleWare/requireLogin')    
 const Post = mongoose.model("Post")
 const User = mongoose.model("User")

 router.get('/profile/:id',requireLogin,(req,res)=>{
    const id=req.params.id
    User.findOne({_id:id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:id})
        .populate("postedBy","_id name")
        .exec((err,post)=>{
            if(err)
            {
              return res.status(422).json({error:err})  
            }
            return res.json({user,post})
        })
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
 })

router.put("/follow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:({followers:req.user.id})
    },{
        new:true
    },(err,result)=>{
        if(err)
        {
           return res.status(422).json({error:err}) 
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:({following:req.body.followId})
        },{
          new:true  
        }).select("-password").then(result=>{
            return res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put("/unfollow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:({followers:req.user._id})
    },{
        new:true
    },(err,result)=>{
        if(err)
        {
           return res.status(422).json({error:err}) 
        }

        User.findByIdAndUpdate(req.user._id,{
            $pull:({following:req.body.unfollowId})
        },{
          new:true  
        }).select("-password").then(result=>{
            return res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put("/updatepic",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{pic:req.body.pic}
    },{new:true})
    .select("-password").then(result=>{
        return res.json(result)
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })
})

router.get('/getuser',(req,res)=>{
    User.find()
    .then(result=>{
        return res.json(result)
    })
})

module.exports = router
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

router.post('/search-users',requireLogin,(req,res)=>{
   const query = new RegExp(`^${req.body.query}`)
   User.find({name:{$regex:query,$options: 'i'}})
   .then(user=>{
       return res.json(user)
   })
   .catch(err=>{
       return res.status(422).json({error:err})
   })
})

router.put('/editprofile',requireLogin,(req,res)=>{
  console.log(req.body.pic)  
  User.findByIdAndUpdate(req.user._id,{
      $set:{
          name:req.body.name,
          email:req.body.email,
          pic:req.body.pic
        }
        },
      {new:true}
  ).select("-password")
  .then(result=>{
        return res.json(result)
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })   
})
module.exports = router
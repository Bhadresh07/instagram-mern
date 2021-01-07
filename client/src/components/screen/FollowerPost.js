import React,{useContext,useState,useEffect} from 'react'
import { UserContext } from '../../App'
import {Link} from 'react-router-dom'

const FollowerPost = ()=>{
    const {state,dispatch} = useContext(UserContext)
    const [data,setData] = useState([])
    
    useEffect(()=>{
     fetch("/followerposts",{
         method:"get",
         headers:{
             "Authorization":"Bearer "+localStorage.getItem("jwt")
         }
     })
     .then(res=>res.json())
     .then(result=>{
         console.log(result)
         setData(result.posts)
     })
     .catch(err=>{
         console.log(err)
     })
    },[])

    const likePost=(id)=>{
        fetch('/likes',{
            method:"put",
            headers:{
              "Authorization":`Bearer ${localStorage.getItem("jwt")}`,
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
             const newData = data.map(item=>{
                 if(item._id===result._id)
                 {
                    return result 
                 }
                 else
                 {
                    return item 
                 }
             })
             setData(newData)
        }).catch((err)=>{
            console.log(err)
        })
    }
    const unlikePost=(id)=>{
        fetch('/unlikes',{
            method:"put",
            headers:{
              "Authorization":`Bearer ${localStorage.getItem("jwt")}`,
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
             const newData = data.map(item=>{
                 if(item._id===result._id)
                 {
                    return result 
                 }
                 else
                 {
                    return item 
                 }
             })
             setData(newData)
        }).catch((err)=>{
            console.log(err)
        })
    }

    const postComment=(text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("jwt")}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData=data.map(item=>{
                if(item._id===result._id)
                {
                   return result 
                }
                else
                {
                   return item 
                }
            })
            setData(newData) 
        }).catch((err)=>{
            console.log(err)
        })
    }

    const deletePost=(id)=>{
        fetch(`/deletepost/${id}`,{
            method:"delete",
            headers:{
                "Authorization": `Bearer ${localStorage.getItem("jwt")}`
            }
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.filter(item=>{
                 return item._id!==result._id
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    
    return (
        <div className="home">
                {data.map(item=>(
                <div className="card home-card" key={item._id}>
                  <h5><Link to={state._id===item.postedBy._id?'/profile':`/profile/${item.postedBy._id}`}>{item.postedBy.name}</Link>{state._id===item.postedBy._id&&
                  <i className="material-icons" style={{color:"red",float:"right"}}onClick={()=>{deletePost(item._id)}}>delete</i>}</h5>
                    <div className="card-image">
                        <img src={item.photo} alt="no photo"/>
                    </div>
                    <div className="card-content">
                    <i className="material-icons" style={{color:"red"}}>favorite</i>
                    {item.likes.includes(state._id)?
                    <i className="material-icons" onClick={()=>{unlikePost(item._id)}}>thumb_down</i>
                    :<i className="material-icons" onClick={()=>{likePost(item._id)}}>thumb_up</i>}
                        <h6>{item.likes.length} likes</h6>    
                        <h6>{item.title}</h6>
                        <p>{item.body}</p>
                        {
                          item.comments.map(record=>{
                              return <h6><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                          })  
                        }
                        <form onSubmit={(e)=>{postComment(e.target[0].value,item._id)}}>
                          <input type="text" placeholder="add a comment"/>
                        </form>
                    </div>
                </div>
                ))
                }
        </div>
    )
}

export default FollowerPost
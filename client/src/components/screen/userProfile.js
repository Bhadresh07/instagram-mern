import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'


const UserProfile = ()=>{
    const [profile,setProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {id} = useParams()
    const [follow,setFollow] = useState((state&&state.following.includes(id)))
    useEffect(()=>{
      fetch(`/profile/${id}`,{
          headers:{
              "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
      })
      .then(res=>res.json())
      .then(result=>{ 
         setProfile(result)
      })
      .catch(err=>{
          console.log(err)
      })
    },[])

    const followuser=()=>{
       fetch("/follow",{
           method:"put",
           headers:{
               "Authorization":`Bearer ${localStorage.getItem("jwt")}`,
               "Content-Type": "application/json"
           },
           body:JSON.stringify({
               followId:id
           })
       }).then(res=>res.json())
       .then(result=>{
           dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
           localStorage.setItem("user",JSON.stringify(result))
           setProfile((prevState)=>{
               return {...prevState,
               user:{
                   ...prevState.user,
                   followers:[...prevState.user.followers,result._id]
               }
            }
           })
           setFollow(true)
       })
    }
    
    const unfollowuser=()=>{
       fetch("/unfollow",{
           method:"put",
           headers:{
               "Authorization":`Bearer ${localStorage.getItem("jwt")}`,
               "Content-Type": "application/json"
           },
           body:JSON.stringify({
               unfollowId:id
           })
       }).then(res=>res.json())
       .then(result=>{
           dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
           localStorage.setItem("user",JSON.stringify(result))
           setProfile((prevState)=>{
               const newFollowers = prevState.user.followers.filter(item=>item!==result._id)
               return {...prevState,
               user:{
                   ...prevState.user,
                   followers:newFollowers
               }
            }
           })
           setFollow(false)
       })
    }

    const fetchFollowers=()=>{
       profile.user.followers.map(item=>(
           console.log(item)
       ))
    }
    
    const fetchFollowing=()=>{
       profile.user.following.map(item=>(
           console.log(item)
       ))
    }

    return (
        <>
        {profile&&
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}src={state&&state.pic} alt="im">
                    </img>
                </div>
                {profile!=null?
                <div>
                    <h4>{profile.user.name}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{profile.post.length} post</h6>
                        <h6 onClick={()=>fetchFollowers()}>{profile.user.followers.length} followers</h6>
                        <h6 onClick={()=>fetchFollowing()}>{profile.user.following.length} following</h6>
                    </div>
                    {follow?
                    <button className="btn waves-effect grey lighten-4" style={{color:'black'}} onClick={()=>unfollowuser()}>
                        Following
                    </button>:
                    <button className="btn waves-effect blue lighten-1" style={{color:'black'}} onClick={()=>followuser()}>
                        Follow
                    </button>
                    }  
                </div>
                :<h4>"loading"</h4>
               }
            </div>
            <div className="gallery">
                {
                    profile.post.map(item=>(
                        <img className="item" key={item._id} src={item.photo} alt={item.title}/>        
                    ))  
                }
            </div>
        </div>}
        </>
    )
}

export default UserProfile
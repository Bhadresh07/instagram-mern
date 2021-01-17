import React,{useState,useEffect,useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../../App'

const Profile = ()=>{
    const [post,setPost] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
      fetch("/mypost",{
          headers:{
              "Authorization": `Bearer ${localStorage.getItem("jwt")}`
          }
      })
      .then(res=>res.json())
      .then(result=>{
         console.log(result) 
         setPost(result.mypost)
      })
      .catch(err=>{
          console.log(err)
      })
    },[])

    return (
        <div style={{maxWidth:"550px",margin:"0px auto"}}> 
           <div style={{
              margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>
           <div style={{
               display:"flex",
               justifyContent:"space-around",
              
           }}>
                <div>
                <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src={state&&state.pic} alt="im"/>
                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                    <h6>{post.length} post</h6>
                    <h6>{state&&state.followers?state.followers.length:"0"} followers</h6>
                    <h6>{state&&state.following?state.following.length:"0"} following</h6>
                </div>    
                </div>
            </div>
            <Link to='/editprofile'>
            <div className="btn waves-effect blue lighten-1" style={{color:'black',margin:"10px",marginLeft:"295px"}}>
                edit profile
            </div>
            </Link>
           </div>  
            <div className="gallery">
                {
                    post.map(item=>(
                        <img className="item" key={item._id} src={item.photo} alt={item.title}/>        
                    ))  
                }
            </div>
        </div>
    )
}

export default Profile
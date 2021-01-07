import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'

const Profile = ()=>{
    const [post,setPost] = useState([])
    const [url,setUrl] = useState("")
    const [image,setImage] = useState("")
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
    
    useEffect(()=>{
      if(image)
      {
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","doehzrtdh")
        
        fetch("https://api.cloudinary.com/v1_1/doehzrtdh/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
           
           fetch("/updatepic",{
             method:"put",
             headers:{
                 "Authorization":`Bearer ${localStorage.getItem("jwt")}`,
                 "Content-Type":"application/json"
             },
             body:JSON.stringify({
                 pic:data.url
             })   
           }).then(res=>res.json())
           .then(result=>{
              localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
              dispatch({type:"UPDATEPIC",payload:result.pic})
           })
           setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })  
      }
    },[image])

    const updatePhoto = (file)=>{
        setImage(file)
    }
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
            <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>Update pic</span>
                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
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
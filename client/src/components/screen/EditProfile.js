import React,{useState,useEffect,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'

const EditProfile = ()=>{
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [name,setName] = useState(state&&state.name)
    const [email,setEmail] = useState(state&&state.email)
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(state&&state.pic)
    
    const uploadPic = ()=>{
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
           setUrl(data.url)
        })
        .then(()=>{
          if(url!==(state&&state.pic))
          {
           uploadFields()
          }
         }
        )
        .catch(err=>{
            console.log(err)
        })
    }
   
    const uploadFields=()=>{
       if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
     {
       M.toast({html:"invalid email",classes:"#ff8a80 red accent-1"})  
       return 
     }
        fetch("/editprofile",{
            method:"put",
            headers:{
                "Authorization":`Bearer ${localStorage.getItem("jwt")}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                pic:url
            })
        }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html:data.error,classes:"#ff8a80 red accent-1"})
                }
                else{
                    M.toast({html:"edited profile successfully",classes:"#81c784 green lighten-2"})
                    dispatch({type:"UPDATEPROFILE",payload:data})
                    history.push('/profile')
                }
                console.log(data)
        }).catch(error=>{
            console.log(error)
        })
    } 

    const PostData=()=>{
        if(image)
        {
          uploadPic()
          console.log("image posted")
        }
        else
        {
          uploadFields()
        }   
    }

    return (
        <div className="mycard">
        <div className="card auth-card">
          <h2>Instagram</h2>
          <div>
            <img style={{width:"160px",height:"160px",borderRadius:"80px"}} src={state&&state.pic} alt="im"/>
          </div>
          <div className="file-field input-field">
            <div className="btn waves-effect blue lighten-1" style={{color:'black'}}>
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
          </div>
          <input
           type="text"
           placeholder="name"
           value={name}
           onChange={(e)=>setName(e.target.value)}
           />
          <input
           type="text"
           placeholder="email"
           value={email}
           onChange={(e)=>setEmail(e.target.value)}
           />
           <button className="btn waves-effect blue lighten-1" style={{color:'black'}} onClick={()=>PostData()}>
               Edit Profile
           </button>  
        </div>
        </div>
    )
}

export default EditProfile
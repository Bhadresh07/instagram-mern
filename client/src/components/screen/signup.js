import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = ()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
    
    useEffect(()=>{
      if(url)
      {
        uploadPic()  
      }
    },[url])

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
        .then(
           uploadFields() 
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
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html:data.error,classes:"#ff8a80 red accent-1"})
                }
                else{
                    M.toast({html:data.message,classes:"#81c784 green lighten-2"})
                    history.push('/signin')
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
           <input
           type="password"
           placeholder="password"
           value={password}
           onChange={(e)=>setPassword(e.target.value)}
           />
           <div className="file-field input-field">
            <div className="btn waves-effect blue lighten-1" style={{color:'black'}}>
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>
           <button className="btn waves-effect blue lighten-1" style={{color:'black'}} onClick={()=>PostData()}>
               Sign Up
           </button> 
           <h5>
               <Link to="/signin">Already have account</Link>
           </h5>  
        </div>
        </div>
    )
}

export default Signup
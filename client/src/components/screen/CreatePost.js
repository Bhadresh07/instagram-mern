import React,{useState,useEffect} from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'
const CreatePost = ()=>{

    const history = useHistory()
    const [title,setTitle]=useState("")
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    
    useEffect(()=>{
     if(url){   
     fetch("/createPost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                 title,
                 body,
                 pic:url
            })
        })
        .then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                    M.toast({html:data.error,classes:"#ff8a80 red accent-1"})
                }
                else{
                    M.toast({html:"created post successfully",classes:"#81c784 green lighten-2"})
                    history.push('/')
                }
                console.log(data)
        }).catch(error=>{
            console.log(error)
        })}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[url])

    const postDetails=()=>{
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
        .catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className= "card input-field"style={{margin:"30px auto",maxWidth:"500px",padding:"20px",textAlign:"center"}}>
            <input type="text" placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)}/>
            <input type="text" placeholder="body" value={body} onChange={(e)=>setBody(e.target.value)}/>
            <div className="file-field input-field">
            <div className="btn">
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>
            <button className="btn waves-effect waves-light" onClick={()=>postDetails()}>
               Submit
           </button>
        </div>
        
    )
}

export default CreatePost
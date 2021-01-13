import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'
{/* <div className="file-field input-field" style={{margin:"10px"}}> */}
{/* <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} /> */}
{/* <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div> */}

const EditProfile = ()=>{
    const [url,setUrl] = useState("")
    const [image,setImage] = useState("")
    
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
}

export default EditProfile
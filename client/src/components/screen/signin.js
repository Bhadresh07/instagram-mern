import React,{useState,useContext} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../../App'
const Signin = ()=>{
    const history = useHistory()
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const {state,dispatch} = useContext(UserContext)
    const PostData=()=>{
     if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))
     {
       M.toast({html:"invalid email",classes:"#ff8a80 red accent-1"})  
      return 
     }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                    M.toast({html:data.error,classes:"#ff8a80 red accent-1"})
                }
                else{
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user",JSON.stringify(data.user))
                    dispatch({type:"USER",payload:data.user})
                    M.toast({html:"signedin successfully",classes:"#81c784 green lighten-2"})
                    history.push('/')
                }
                console.log(data)
        }).catch(error=>{
            console.log(error)
        })
    }
    return (
        <div className="mycard">
        <div className="card auth-card">
          <h2>Instagram</h2>
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
           <button className="btn waves-effect blue lighten-1" style={{color:'black'}} onClick={()=>PostData()}>
               Signin
           </button> 
           <h5>
               <Link to="/signup">Don't have an account</Link>
           </h5> 
        </div>
        </div>
    )
}

export default Signin
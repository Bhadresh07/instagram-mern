import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link,useHistory} from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const NavBar = ()=>{
  const searchModal = useRef(null)
  const [search,setSearch] = useState('')
  const [userDetails,setUserDetails] = useState([])
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(()=>{
   M.Modal.init(searchModal.current)
  },[])
  const renderList=()=>{
    if(state)
    {
       return [
          <li key="1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
          <li key="2"><Link to="/profile">Profile</Link></li>,
          <li key="3"><Link to="/createpost">Createpost</Link></li>,
          <li key="4"><Link to="/followerposts">Followerpost</Link></li>,
          <li key="5">
            <button className="btn #c62828 red darken-3" onClick={()=>{
               localStorage.clear()
               dispatch({type:"CLEAR"})
               history.push('/signin')
            }}>
               Logout
           </button> 
          </li> 
       ]
    }
    else
    {
       return [
          <li key="6"><Link to="/signin">Signin</Link></li>,
          <li key="7"><Link to="/signup">Signup</Link></li>
       ]
    }
  }
  const searchUser=(query)=>{
     setSearch(query)
     if(query)
     {
     fetch('/search-users',{
        method:"post",
        headers:{
           "Authorization":`Bearer ${localStorage.getItem("jwt")}`,
           "Content-Type": "application/json"
        },
        body:JSON.stringify({
           query
        })
     }).then(res=>res.json())
     .then(result=>{
          setUserDetails(result)
          console.log(result)
     })
     .catch(err=>{
        console.error(err)
     })
     }
  }
  return (
      <nav>
        <div className="nav-wrapper white" >
          <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
           {renderList()}   
          </ul>
       </div>
       <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
         <div className="modal-content">
            <input
           type="text"
           placeholder="search user"
           value={search}
           onChange={(e)=>searchUser(e.target.value)}
           />
           <ul class="collection">
               {userDetails.map(item=>{
                  return (
                  <Link to={state&&state._id===item._id?'/profile':`/profile/${item._id}`}onClick={()=>{
                    M.Modal.getInstance(searchModal.current).close()
                    setSearch('')
                  }}>  
                  <li class="collection-item avatar">
                     <img src={item.pic} alt={item.name} class="circle"/>
                     <span className="title">{item.name}</span>
                  </li></Link>)
               })}
            </ul> 
         </div>
         <div className="modal-footer">
            <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</a>
         </div>
        </div>
      </nav>
    )
}

export default NavBar
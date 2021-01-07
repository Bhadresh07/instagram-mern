import React,{useEffect,createContext,useReducer,useContext} from 'react';
import './App.css';
import Navbar from './components/navbar'
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screen/home'
import Profile from './components/screen/profile'
import Signin from './components/screen/signin'
import Signup from './components/screen/signup'
import CreatePost from './components/screen/CreatePost'
import UserProfile from './components/screen/userProfile'
import FollowerPost from './components/screen/FollowerPost'

import { reducer,initialState } from './reducer/userReducer';

export const UserContext = createContext()

const Routing=()=>{
  const history = useHistory()
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
   const user = JSON.parse(localStorage.getItem("user"))
   if(user)
   {
     dispatch({type:"USER",payload:user})
     history.push('/')
   }
   else
   {
     history.push('/sigin')
   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <Switch>
      <Route exact path="/">
       <Home/>
      </Route>
      <Route exact path="/profile">
       <Profile/>
      </Route>
      <Route path="/signin">
       <Signin/>
      </Route>
      <Route path="/signup">
       <Signup/>
      </Route>
      <Route path="/createpost">
       <CreatePost/>
      </Route>
      <Route path="/profile/:id">
       <UserProfile/>
      </Route>
      <Route path="/followerposts">
       <FollowerPost/>
      </Route>
    </Switch>
  )
}
function App() {
  const [state, dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
     <BrowserRouter>
     <Navbar/>
     <Routing/>
     </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

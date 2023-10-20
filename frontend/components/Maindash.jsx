import React, { useEffect, useState } from 'react'
import Login from './Login'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Admindash from './Admindash';


function Maindash() {
const [loggedin,setLoggedin]=useState(false);

const auth=getAuth();


useEffect(()=>{
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      setLoggedin(true);
      // ...
    } else {
      // User is signed out
      // ...
      
    }
  });
},[])

  return (
    <div class='flex-col dashboard'>
      <h1>Admin Dashboard</h1>
      {loggedin?<Admindash loggedin={loggedin} setLoggedin={setLoggedin}/>:<Login/>}
      
    </div>
  )
}

export default Maindash
import { getAuth, signOut } from 'firebase/auth'
import React from 'react'

function Admindash({loggedin,setLoggedin}) {

    const auth=getAuth();
    const handleLogout=()=>{
        signOut(auth);
        setLoggedin(false);
      }

  return (
    <div>
    <div>Welcome Admin</div>
    <button onClick={handleLogout}>SignOut</button>
    </div>
  )
}

export default Admindash
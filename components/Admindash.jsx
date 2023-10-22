import { getAuth, signOut } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom';

function Admindash() {
    const navigate=useNavigate();
    const auth=getAuth();
    const handleLogout=async ()=>{
        await signOut(auth);
        navigate('/');
      }

  return (
    <div>
    <div class='flex-col dashboard'>
    <button class="btn-secondary-medium-text" onClick={handleLogout}>SignOut</button></div>
    
    </div>
  )
}

export default Admindash
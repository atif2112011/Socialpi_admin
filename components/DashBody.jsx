import { getAuth, signOut } from 'firebase/auth'
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function DashBody() {
    const navigate=useNavigate();
    const auth=getAuth();
    const {CurrentUser}=useSelector(state=>state.users)

    

  return (
    <div>
    <div class='flex-col dashboard'>
    <h1>Admins</h1>
    <span>Admin Type:{CurrentUser}</span>
    {console.log('User',CurrentUser)}
    </div>
    
    </div>
  )
}

export default DashBody
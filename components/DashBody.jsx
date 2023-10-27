import { getAuth, signOut } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { database } from '../src/firebaseConfig';
import AdminsBody from './AdminsBody';

function DashBody({selectedOption,SetSelectedOption}) {
    const {CurrentUser}=useSelector(state=>state.users)
    


  
   

  return (
    CurrentUser && <div>
    <AdminsBody selectedOption={selectedOption} SetSelectedOption={SetSelectedOption}></AdminsBody>
    
    </div>
  )
}

export default DashBody
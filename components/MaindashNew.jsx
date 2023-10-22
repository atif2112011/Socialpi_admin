import React, { useEffect } from 'react'
import DashMenu from './DashMenu'
import Admindash from './Admindash'
import { useDispatch, useSelector } from 'react-redux'
import {SetLoader} from '../redux/loadersSlice'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { SetCurrentUser } from '../redux/userSlice'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { database } from '../src/firebaseConfig'

function Maindash() {

  const auth = getAuth();

  const navigate=useNavigate();
  const dispatch=useDispatch();
  const collectionRef=collection(database,'admins')
  const {CurrentUser}=useSelector(state=>state.users)

  const checkAdmin=(user)=>{
    console.log('Inside Dash checkadmin')
    const q = query(collectionRef, where("email", "==", `${user.email}`));
    getDocs(q)
    .then((querySnapshot)=>{
      if (!querySnapshot.empty) {
        console.log("Valid Admin")
        dispatch(SetCurrentUser('SuperAdmin'));
      
        navigate('/dashboard');
        dispatch(SetLoader(false));
        
        
      } else {
        console.log('Not Valid Admin');
        signOut(auth);
        setShowpopup(true);
        dispatch(SetLoader(false));
        
  
      }
    })
    
  }

  useEffect(() => {
    console.log('inside dahsboard useEffect')
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log("Inside dashbaord onauth")
      if (user) {
        
        if(CurrentUser==null)
        {
          checkAdmin(user)
        }
       

      } else {
     
        navigate('/');
      }
    });
    return () => unsubscribe(); // Cleanup the subscription on component unmount
  }, []);
  
  return (
    <div class='flex ' >
        <DashMenu/>
        <Admindash/>

    </div>
  )
}

export default Maindash
import React, { useEffect, useState } from 'react'
import DashMenu from './DashMenu'
import DashBody from './DashBody'
import { useDispatch, useSelector } from 'react-redux'
import {SetLoader} from '../redux/loadersSlice'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { SetCurrentUser } from '../redux/userSlice'
import { collection, doc, getDocs, query, where } from 'firebase/firestore'
import { database } from '../src/firebaseConfig'


function Maindash() {

  const auth = getAuth();

  const navigate=useNavigate();
  const dispatch=useDispatch();
  const collectionRef=collection(database,'admins')
  const {CurrentUser}=useSelector(state=>state.users)
  const [selectedOption,setSelectedOption]=useState('Admins')
  
  const checkAdmin=(user)=>{
    console.log('Inside Dash checkadmin')
    const q = query(collectionRef, where("email", "==", `${user.email}`));
    getDocs(q)
    .then((querySnapshot)=>{
      if (!querySnapshot.empty) {

        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
  
          const Userdata=doc.data();
          
          const user={
            id:doc.id,
            ...Userdata
          }
  
          console.log(doc.id, " => ", user);
  
          dispatch(SetCurrentUser(user))
          
        });
        console.log("Valid Admin")
        // dispatch(SetCurrentUser('SuperAdmin'));
      
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

  const populateAdmins=async ()=>{
    const querySnapshot = await getDocs(collection(database, "admins"));
    console.log("Fetched Admins:")
    querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  const newAdmin=doc.data();
  const existingAdmins=admins;
  existingAdmins.push(newAdmin)
  
  setAdmins(existingAdmins);
  console.log(doc.id, " => ", doc.data());
});
console.log("Updated Admins",admins) 
SetshowTable(true);
  }

  useEffect(() => {
    dispatch(SetLoader(true));

    console.log('inside dahsboard useEffect')
    const unsubscribe = auth.onAuthStateChanged(user => {
      console.log("Inside dashbaord onauth")
      if (user) {
        
        if(CurrentUser==null)
        {
          dispatch(SetLoader(true));
          checkAdmin(user)
        }
       

      } else {
     
        navigate('/');
        dispatch(SetLoader(false))
      }
    });
    return () => unsubscribe(); // Cleanup the subscription on component unmount
  }, []);
  
  return (
    <div class='flex maindash' >
        <DashMenu selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>
        <DashBody selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>

    </div>
  )
}

export default Maindash
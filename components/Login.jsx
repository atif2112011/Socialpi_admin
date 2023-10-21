import React, { useState } from 'react'
import { app, database } from '../src/firebaseConfig';
import {getAuth,GoogleAuthProvider,signInWithPopup, signOut} from 'firebase/auth'
import { collection, addDoc ,getDocs, updateDoc, doc, deleteDoc, onSnapshot,query,where, getDoc, Query} from "firebase/firestore";
import Popup from 'reactjs-popup';

function Login({loggedin,setLoggedin,wait,setWait}) {
 const [showpopup,setShowpopup]=useState(false)
 
  
  const auth = getAuth();
  const GoogleProvider= new GoogleAuthProvider();
  const collectionRef=collection(database,'admins')

const closePopup=()=>{
  setShowpopup(false);
}




  const handleLogin=async ()=>{
    
    
       
    signInWithPopup(auth, GoogleProvider)
      .then((userCredential) => {
        // alert('Login Success')
        setWait(true); 
        console.log('Wait:',wait)
        const userData={
          name:userCredential.user.displayName,
          email:userCredential.user.email
        }
        console.log(userData);

        const q = query(collectionRef, where("email", "==", `${userData.email}`));
  getDocs(q)
  .then((querySnapshot)=>{
    if (!querySnapshot.empty) {
      console.log("Valid Admin")
      setLoggedin(true)
    } else {
      console.log('Not Valid Admin');
      signOut(auth);
      setLoggedin(false);
      setShowpopup(true);

    }
    setWait(false);
  })

      })
      .catch((error) => {
        signOut(auth);
        alert(error.message);
        
        
      });

     const response=await verifyAdmin(userData);

    }

    const PopupExample = () => (
      <Popup open={showpopup} position="right center" closeOnDocumentClick onClose={closePopup}>
        <div class="modal">
          <a class='close' onClick={closePopup}>
          No Admin Privileges found!!
          </a>
        </div>
      </Popup>
    );

  return (
    <div class="login flex-col">
      <PopupExample/>
        <div class="login-container flex-col">
            <h2>Login or Signup</h2>
            <button class="login-signin-btn" onClick={handleLogin}>
                <img src="../media/google logo.png" height='40' width='40' alt="google sign in"/><span>Continue with Google</span>

                </button>
            <span class='login-footer'>By continuing, you agree to our <b>Terms of Use</b>.<br></br>Read our <b>Privacy Policy</b> .</span>
        </div>
    </div>
  )
}

export default Login
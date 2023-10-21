import React, { useState } from 'react'
import { app, database } from '../src/firebaseConfig';
import {getAuth,GoogleAuthProvider,signInWithPopup, signOut} from 'firebase/auth'
import { collection, addDoc ,getDocs, updateDoc, doc, deleteDoc, onSnapshot,query,where, getDoc, Query} from "firebase/firestore";
import Popup from 'reactjs-popup';

function Login({loggedin,setLoggedin}) {
 const [showpopup,setShowpopup]=useState(false)
  
  const auth = getAuth();
  const GoogleProvider= new GoogleAuthProvider();
  const collectionRef=collection(database,'admins')

const closePopup=()=>{
  setShowpopup(false);
}


const verifyAdmin=(data)=>{
  const q = query(collectionRef, where("email", "==", `${data.email}`));
  getDocs(q)
  .then((querySnapshot)=>{
    if (!querySnapshot.empty) {
      console.log("Valid Admin")
      return true;
    } else {
      console.log('Not Valid Admin');
      return false;

    }
  })
  .catch((error)=>{
    alert(error.message)
  })
  
 }
  const handleLogin=()=>{
        
    signInWithPopup(auth, GoogleProvider)
      .then(async (userCredential) => {
        // alert('Login Success')
        const userData={
          name:userCredential.user.displayName,
          email:userCredential.user.email
        }
        console.log(userData);
        const isAdmin=await verifyAdmin(userData);
        if(isAdmin==false)
        {
        signOut(auth);
        setLoggedin(false);
        setShowpopup(true);
        }
       

      })
      .catch((error) => {
        signOut(auth);
        alert(error.message);
        
        
      });
    }

    const PopupExample = () => (
      <Popup open={showpopup} position="right center" closeOnDocumentClick onClose={closePopup}>
        <div class="modal">
          <a class='close' onClick={closePopup}>
          No Admin Privileges!!
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
import React from 'react'
import { app, database } from '../src/firebaseConfig';
import {getAuth,GoogleAuthProvider,signInWithPopup, signOut} from 'firebase/auth'
import { collection, addDoc ,getDocs, updateDoc, doc, deleteDoc, onSnapshot,query,where, getDoc, Query} from "firebase/firestore";

function Login() {
 
  
  const auth = getAuth();
  const GoogleProvider= new GoogleAuthProvider();
  const collectionRef=collection(database,'admins')


 const verifyAdmin=async(data)=>{
  const q = query(collectionRef, where("email", "==", `${data.email}`));
  
 }
  const handleLogin=()=>{
        
    signInWithPopup(auth, GoogleProvider)
      .then(async (userCredential) => {
        alert('Login Success')
        const userData={
          name:userCredential.user.displayName,
          email:userCredential.user.email
        }
        console.log(userData);
        await verifyAdmin(userData);

      })
      .catch((error) => {
        signOut(auth);
        alert(error.message);
        
        
      });
    }

  return (
    <div class="login flex-col">
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
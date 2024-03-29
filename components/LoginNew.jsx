import React, { useEffect, useState } from 'react'
import { app, database } from '../src/firebaseConfig';
import {getAuth,GoogleAuthProvider,onAuthStateChanged,signInWithPopup, signOut} from 'firebase/auth'
import { collection, addDoc ,getDocs, updateDoc, doc, deleteDoc, onSnapshot,query,where, getDoc, Query} from "firebase/firestore";
import Popup from 'reactjs-popup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SetLoader } from '../redux/loadersSlice';
import { SetCurrentUser } from '../redux/userSlice';

function Login() {
 const [showpopup,setShowpopup]=useState(false)
 
  
  const auth = getAuth();
  const GoogleProvider= new GoogleAuthProvider();

  GoogleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  
  const collectionRef=collection(database,'admins')

  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {CurrentUser}=useSelector(state=>(state.users));



  //For firebase login
  

const closePopup=()=>{
  setShowpopup(false); 
}



const checkAdmin=(user)=>{
  var Validatinguser={};
  const q = query(collectionRef, where("email", "==", `${user.email}`));
  getDocs(q)
  .then((querySnapshot)=>{
    if (!querySnapshot.empty) {

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots

        const Userdata=doc.data();
        
        const Validatinguser={
          id:doc.id,
          ...Userdata
        }
        
        if(Userdata.active==false)
        throw new Error('Invalid Admin')

        console.log(doc.id, " => ", Validatinguser);

        dispatch(SetCurrentUser(Validatinguser))
        
      });

      console.log("Valid Admin")
      // dispatch(SetCurrentUser('SuperAdmin'));
    
      navigate('/dashboard');
      dispatch(SetLoader(false));
      
      
    } else 
      throw new Error('Invalid Admin')
  })
  .catch((err)=>{
    console.log('Not Valid Admin');
      signOut(auth);
      setShowpopup(true);
      dispatch(SetLoader(false));
  })
  
}

  const handleLogin=async ()=>{
    
    // dispatch(SetLoader(true));
    signInWithPopup(auth, GoogleProvider)
      .then((userCredential) => {
        // alert('Login Success')
        
        
        const userData={
          name:userCredential.user.displayName,
          email:userCredential.user.email
        }
        console.log(userData);

        

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
          No Admin Privileges found!!
          </a>
        </div>
      </Popup>
    );

    


    useEffect(()=>{
      // dispatch(SetLoader(true));

      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          dispatch(SetLoader(true));
          console.log('Inside onAuth')
          // navigate('/dashboard');
          const uid = user.uid;
          // const userDetails={
          //   name:user.user.displayName,
          //   email:user.user.email
          // }
          console.log('User Details:',user);
          const response=checkAdmin(user);
          
         
          
          // ...
        } else {
          // User is signed out
          // ...
          // dispatch(SetLoader(false))
        }
      });
    })
   

  return (
    <div class="login flex-col">
      <PopupExample/>
        <div class="login-container flex-col">
            <h2>Login or Signup</h2>
            <button class="login-signin-btn" onClick={handleLogin} >
                <img src="https://firebasestorage.googleapis.com/v0/b/fir-frontend-8cae2.appspot.com/o/icons%2Fgoogle%20logo.png?alt=media&token=29e94f50-56ff-4902-90bb-f3a6badf773e" height='40' width='40' alt="google sign in"/><span>Continue with Google</span>

                </button>
            <span class='login-footer'>By continuing, you agree to our <b>Terms of Use</b>.<br></br>Read our <b>Privacy Policy</b> .</span>
        </div>
    </div>
  )
}

export default Login

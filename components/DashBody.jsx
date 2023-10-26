import { getAuth, signOut } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { database } from '../src/firebaseConfig';

function DashBody({selectedOption,SetSelectedOption}) {
    const navigate=useNavigate();
    const auth=getAuth();
    const {CurrentUser}=useSelector(state=>state.users)
    
   const [admins,setAdmins]=useState([]);
   const [showTable,SetshowTable]=useState(false);


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

   useEffect(()=>{
    populateAdmins();
   },[])
   

  return (
    CurrentUser && <div>
    <div class='flex-col dashboard'>
    <div class='flex dashboard_header'>
      <h1>Admins</h1>
      <div class='flex '>
        <button class='btn-primary-small-button-icon'
        hidden={CurrentUser.superadmin?true:false}
        >Add Admin
        <img class="menu_icon" src='../media/icons/add.svg' height='20px' width='20px' style={{filter: 'invert(1)'}}></img>
         </button>
        <input class='search_admin'type='text' placeholder='Search Admins....'></input>
      </div>

    </div>

    <div class='admin_table'
    >
      {showTable &&<table>
        <thead>
        <tr>
            <th>Admins</th>
            <th>Role</th>
            <th>Permissions</th>
            <th>Active</th>
            <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {/* <tr>
            <td>Atif</td>
            <td>View,Edit</td>
            <td>SuperAdmin</td>
            <td>Yes</td>
            <td>-</td>
        </tr> */}
        {admins.map((value)=>{
          return(
            <tr>
              <td>{value.name}</td>
              <td>{value.superadmin?'SuperAdmin':'Admin'}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              
            </tr>
          )

        })}
        </tbody>
      </table>}
    </div>



    
    </div>
    
    </div>
  )
}

export default DashBody
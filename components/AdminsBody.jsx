import { getAuth, signOut } from 'firebase/auth'
import { QuerySnapshot, addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { database } from '../src/firebaseConfig';
import Modal from 'react-modal'
import { SetLoader } from '../redux/loadersSlice';

function AdminsBody() {

    const navigate=useNavigate();
    const auth=getAuth();
    const dispatch=useDispatch()
    const {CurrentUser}=useSelector(state=>state.users)
    
   const [admins,setAdmins]=useState([]);
   const [showTable,SetshowTable]=useState(false);
   const [modalIsOpen, SetmodalIsOpen] = useState(false);

   const collectionRef=collection(database,'admins')

    // const populateAdmins=async ()=>{
    //     SetshowTable(false);
    //     setAdmins([]);
    //     const querySnapshot = await getDocs(collection(database, "admins"));
    //     console.log("Fetched Admins:")
    //     querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   var newAdmin=doc.data();
    //   const existingAdmins=admins;
    //   newAdmin={...newAdmin,...{id:doc.id}}
    //   existingAdmins.push(newAdmin)
      
    //   setAdmins(existingAdmins);
    //   console.log(doc.id, " => ", doc.data());
    // });
    // console.log("Updated Admins",admins) 
    // SetshowTable(true);
    //   }
  
    const populateAdmins = async () => {
      SetshowTable(false);
      setAdmins([]);
      const querySnapshot = await getDocs(collection(database, "admins"));
      console.log("Fetched Admins:")
      let newAdmins = [];
      querySnapshot.forEach((doc) => {
          var newAdmin = doc.data();
          newAdmin = { ...newAdmin, ...{ id: doc.id } };
          newAdmins.push(newAdmin);
          console.log(doc.id, " => ", doc.data());
      });
      setAdmins(prevAdmins => [...prevAdmins, ...newAdmins]); // Use functional update
      console.log("Updated Admins", admins);
      SetshowTable(true);
  }

    const AddAdminButtonAction =()=>{
        console.log('button Clicked')
        SetmodalIsOpen(true)
    } 
   
    const handleSubmit=async(event)=>{
    event.preventDefault(); // Prevents the default form submission behavior

  const formData = new FormData(event.target); // 
  var superadmin = formData.get('superadmin'); // Get the value of the 'superadmin' checkbox
  superadmin==null?superadmin=false:superadmin=true

        const UserData={
            name:formData.get('name'),
            email:formData.get('email'),
            superadmin:superadmin
            
        }

        const q = query(collectionRef, where("email", "==", `${UserData.email}`));

        getDocs(q)
        .then(async (querySnapshot)=>{
          if(!querySnapshot.empty){
              alert("Email Already Exists!!")
              
              document.getElementById("admin_email").focus();

          }
          else
          {
            const docRef = await addDoc(collection(database, "admins"),UserData);
          console.log("Document written with ID: ", docRef.id);

          closeModal();
          dispatch(SetLoader(true));
          await populateAdmins();
          dispatch(SetLoader(false));
          }
        })
        
        
        
        

    }
      
    function closeModal() {
    SetmodalIsOpen(false);
    }

    const queryDB=async(e)=>{
       
        const value=e.target.value;
        console.log("Value",value)

        const q = query(collectionRef, where("name", "==", `${value}`)); 

        try {
            const querySnapshot = await getDocs(q);
            console.log('Queried Data');
            querySnapshot.forEach((doc) => {
              console.log(doc.id , " => ", doc.data());
            });
          } catch (error) {
            console.error("Error querying data:", error);
          }
    }

    useEffect(()=>{
        populateAdmins();
       },[])

       

  return (
    <div class='flex-col dashboard'>
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add AdminModal"
        className="Modal"
      >
        <h2>Add New Admin</h2>
        <form onSubmit={handleSubmit}>
        <div class='flex-col admin_form'>
            <div class>
            <label htmlFor='admin_name'>Admin Name :</label>
            <input class='form_input' type='text' name='name' id='admin_name'></input>
            </div>

            <div class>
            <label htmlFor='admin_email'>Email :</label>
            <input class='form_input' type='email' name='email' id='admin_email'></input>
            </div>

            <div class ='flex checkbox_div'>
            <label htmlFor='super_admin'>Super Admin :</label>
            <input class='form_input_checkbox'type='checkbox' name='superadmin' ></input>
            </div>
            <div class='flex'>
            <button class='btn-primary-small-text' type='submit' >Submit</button>
            <button class='btn-secondary-small-text' onClick={closeModal}>Close</button>
            </div>
            
        </div>
        </form>
        
      </Modal>
    <div class='flex dashboard_header'>
      <h1>Admins</h1>
      <div class='flex '>
        <button class='btn-primary-small-button-icon'
        onClick={AddAdminButtonAction}
        >Add Admin
        <img class="menu_icon" src='../media/icons/add.svg' height='20px' width='20px' style={{filter: 'invert(1)'}}></img>
         </button>
        <input class='search_admin'type='text' placeholder='Search Admins....' onChange={(e)=>queryDB(e)}></input>
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
  )
}

export default AdminsBody
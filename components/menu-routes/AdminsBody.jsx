import { getAuth, signOut } from 'firebase/auth'
import { QuerySnapshot, addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { database } from '../../src/firebaseConfig';
import Modal from 'react-modal'
import { SetLoader } from '../../redux/loadersSlice';
import ReactSwitch from 'react-switch';
import { updateDB,deleteDB, addDB } from '../../db/db';



function AdminsBody() {

    const navigate=useNavigate();
    const auth=getAuth();
    const {CurrentUser}=useSelector(state=>state.users)
    const dispatch=useDispatch()
    
   const [admins,setAdmins]=useState([]);
   const [showTable,SetshowTable]=useState(false);
   const [modalIsOpen, SetmodalIsOpen] = useState(false);
   const [UpdatemodalIsOpen, SetUpdatemodalIsOpen] = useState(false);
   const [adminToUpdate,SetadminToUpdate]=useState({})
   const [tableData,SettableData]=useState([])
   const [formData, SetFormData] = useState({
    name: '',
    email: '',
    superadmin: false,
    create: false,
    view: false,
    edit: false
  });

   const collectionRef=collection(database,'admins')

    

    const  SearchHandler = (e) => {
      //convert input text to lower case
      const lowerCase = e.target.value.toLowerCase();
      // SetsearchText(lowerCase);
      const filteredData = admins.filter((value) => {
        //if no input the return the original
        if (lowerCase === '') {
            return value;
        }
        //return the item which contains the user input
        else {
            return value.name.toLowerCase().includes(lowerCase)
        }
    })
    SettableData(filteredData);
    console.log('Searched Data: ',filteredData)
    };
  
    const populateAdmins = async () => {
      SetshowTable(false);
      setAdmins([]);
      SettableData([]);
      const q=query(collection(database, "admins"),orderBy("name"))
      const querySnapshot = await getDocs(q);
      console.log("Fetched Admins:")
      let newAdmins = [];
      querySnapshot.forEach((doc) => {
          var newAdmin = doc.data();
          newAdmin = { ...newAdmin, ...{ id: doc.id } };
          newAdmins.push(newAdmin);
          console.log(doc.id, " => ", doc.data());
      });
      await setAdmins(prevAdmins => [...prevAdmins, ...newAdmins]); // Used for keeping record of all admins
      await SettableData(prevAdmins => [...prevAdmins, ...newAdmins]); // used for querying table data
      console.log("Updated Admins", admins);

    
      SetshowTable(true);
      dispatch(SetLoader(false));

      
    
  }

//   const updateAdmin = async (userId, payload) => {
//     const success = await updateDB(userId, payload);
//     if (success) {
//         console.log("Data Updated");
//         await populateAdmins();
//         closeModal();
//     }
// }



// const deleteAdmin = async (userId) => {
//   dispatch(SetLoader(true));
//   const success = await deleteDB(userId);
//   if (success) {
//       console.log("Data Deleted");
//       await populateAdmins();
//   }


const updateAdmin = async (userId, payload) => {
  const success = await updateDB(userId, payload);
  if (success) {
    console.log("Data Updated");

    // Find the index of the updated admin in the admins array
    const updatedAdminIndex = admins.findIndex(admin => admin.id === userId);

    if (updatedAdminIndex !== -1) {
      // Create a new array with the updated admin data
      const updatedAdmins = [...admins];
      updatedAdmins[updatedAdminIndex] = { ...updatedAdmins[updatedAdminIndex], ...payload };
      

      // Update the state with the new admin data
      setAdmins(updatedAdmins);
      SettableData(updatedAdmins);
    }

    closeModal();
  }
}



const deleteAdmin = async (userId) => {
  // dispatch(SetLoader(true)); // Assuming this sets a loading state

  const success = await deleteDB(userId); // Assuming deleteDB is a function that handles deletion

  if (success) {
    console.log("Data Deleted");

    // Filter out the deleted admin from the admins array
    const updatedAdmins = admins.filter(admin => admin.id !== userId);

    // Update the state with the new admin data (excluding the deleted admin)
    setAdmins(updatedAdmins);
    SettableData(updatedAdmins);
  }

  
}


   
    const AddNewAdmin = async (event) => {
      event.preventDefault(); 
      

      
    
  
      const success = await addDB({
          name: formData.name,
          email: formData.email,
          superadmin: formData.superadmin,
          create: formData.create,
          view: formData.view,
          edit: formData.edit
      });
  
      if (success) {
          closeModal();
          dispatch(SetLoader(true));
          await populateAdmins();
          dispatch(SetLoader(false));
      }
  }

    const handleUpdateFormSubmit=async(event)=>{
      event.preventDefault(); // Prevents the default form submission behavior
  
          const UserData={
              name:formData.name,
              email:formData.email,
              superadmin:formData.superadmin,
              permissions:{
                create:formData.create,
                view:formData.view,
                edit:formData.edit
              }

              
          }

          await updateAdmin(adminToUpdate.id,UserData)
           
          

          
          
          
          
          
  
      }

      

    const handleReactSwitch=async(checked,id)=>{
      // dispatch(SetLoader(true))
      
      const DatatoUpdate={
        active:checked
      }
    await updateAdmin(id,DatatoUpdate)
    
      
    }
      
    const closeModal=()=>{
    SetmodalIsOpen(false);
    SetUpdatemodalIsOpen(false)
    }


    const populateUpdateModal=async (value)=>{
        await SetFormData({
          name:value.name,
          email:value.email,
          superadmin:value.superadmin,
          create:value.permissions.create,
          view:value.permissions.view,
          edit:value.permissions.edit
        })
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
        <form onSubmit={AddNewAdmin}>
        <div class='flex-col admin_form'>
            <div class>
            <label htmlFor='admin_name'>Admin Name :</label>
            <input class='form_input' type='text' name='name' id='admin_name' required='true' value={formData.name} onChange={(e)=>SetFormData({...formData,name:e.target.value})}></input>
            </div>

            <div class>
            <label htmlFor='admin_email'>Email :</label>
            <input class='form_input' type='email' name='email' id='admin_email' required='true' value={formData.email} onChange={(e)=>SetFormData({...formData,email:e.target.value})}></input>
            </div>

            <div >
              <span>Permissions :</span>
            <div class ='flex permissions_checkboxes'>

              <div class='flex checkbox_div'>
              <label htmlFor='super_admin'>Super Admin :</label>
            <input class='form_input_checkbox'type='checkbox' name='superadmin' id='superadmin' checked={formData.superadmin} onChange={(e)=>SetFormData({...formData,superadmin:e.target.checked})}></input>
              </div>

            <div class='flex checkbox_div'>
            <label htmlFor='create'>Create :</label>
            <input class='form_input_checkbox'type='checkbox' name='create' id='create' checked={formData.create} onChange={(e)=>SetFormData({...formData,create:e.target.checked})}></input>
            </div>

            <div class='flex checkbox_div'>
            <label htmlFor='view'>View :</label>
            <input class='form_input_checkbox'type='checkbox' name='view' id='view' checked={formData.view} 
             onChange={(e)=>SetFormData({...formData,view:e.target.checked})}></input>
            </div>


            <div class='flex checkbox_div'>
            <label htmlFor='edit'>Edit :</label>
            <input class='form_input_checkbox'type='checkbox' name='edit' id='edit' checked={formData.edit} onChange={(e)=>SetFormData({...formData,edit:e.target.checked})} ></input>
            </div>

           
            </div>
           
           
           
            </div>

            <div class='flex'>
            <button class='btn-primary-small-text' type='submit' >Submit</button>
            <button class='btn-secondary-small-text' onClick={closeModal}>Close</button>
            </div>
            
        </div>
        </form>
        
      </Modal>
      <Modal
        isOpen={UpdatemodalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update AdminModal"
        className="Modal"
      >
        <h2>Update Admin</h2>
        <form onSubmit={handleUpdateFormSubmit}>
        <div class='flex-col admin_form'>
            <div class>
            <label htmlFor='name'>Admin Name :</label>
            <input class='form_input' type='text' name='name' id='update_admin_name' required='true' value={formData.name} onChange={(e)=>SetFormData({...formData,name:e.target.value})}></input>
            </div>

            <div class>
            <label htmlFor='email'>Email :</label>
            <input class='form_input' type='email' name='email' id='update_admin_email' required='true' value={formData.email} onChange={(e)=>SetFormData({...formData,email:e.target.value})}></input>
            </div>

            <div >
              <span>Permissions :</span>
            <div class ='flex permissions_checkboxes'>

              <div class='flex checkbox_div'>
              <label htmlFor='super_admin'>Super Admin :</label>
            <input class='form_input_checkbox'type='checkbox' name='superadmin' id='update_superadmin' checked={formData.superadmin} onChange={(e)=>SetFormData({...formData,superadmin:e.target.checked})}></input>
              </div>

            <div class='flex checkbox_div'>
            <label htmlFor='create'>Create :</label>
            <input class='form_input_checkbox'type='checkbox' name='create' id='update_create' checked={formData.create} onChange={(e)=>SetFormData({...formData,create:e.target.checked})}></input>
            </div>

            <div class='flex checkbox_div'>
            <label htmlFor='view'>View :</label>
            <input class='form_input_checkbox'type='checkbox' name='view' id='update_view' checked={formData.view} 
             onChange={(e)=>SetFormData({...formData,view:e.target.checked})}></input>
            </div>


            <div class='flex checkbox_div'>
            <label htmlFor='edit'>Edit :</label>
            <input class='form_input_checkbox'type='checkbox' name='edit' id='update_edit' checked={formData.edit} onChange={(e)=>SetFormData({...formData,edit:e.target.checked})}></input>
            </div>

           
            </div>
           
           
           
            </div>

            

            <div class='flex'>
            <button class='btn-primary-small-text' type='submit' >Update</button>
            <button class='btn-secondary-small-text' onClick={closeModal}>Close</button>
            </div>
            
        </div>
        </form>
        
      </Modal>
    <div class='flex dashboard_header'>
      <h1>Admins</h1>
      <div class='flex '>
        <button class='btn-primary-small-button-icon addAdminBtn'
        onClick={()=>{
          SetFormData({
            name: '',
            email: '',
            superadmin: false,
            create: false,
            view: true,
            edit: false
          })
          SetmodalIsOpen(true)
        }
          
          } disabled={!CurrentUser.permissions.create}
        >Add Admin
        <img class="menu_icon" src='../media/icons/add.svg' height='20px' width='20px' style={{filter: 'invert(1)'}}></img>
         </button>
        <input class='search_admin'type='text' placeholder='Search Admins....' onChange={(e)=>SearchHandler(e)}></input>
      </div>

    </div>

    <div class='admin_table'
    >
      {showTable && <table>
        <thead>
        <tr class='row_header'>
            <th>Admins</th>
            <th>Permissions</th>
            <th>Role</th>
            <th>Active</th>
            <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {/* <tr class='row_body'>
            <td>Atif</td>
            <td>View,Edit</td>
            <td>SuperAdmin</td>
            <td><ReactSwitch
            checked='true'/></td>
            <td><div >
            <img class="pencil_icon" src='../media/icons/pencil.svg' height='22px' width='22px'></img> 
            <img class="trash_icon" src='../media/icons/trash.svg' height='22px' width='22px'></img> 
              </div></td>
            
        </tr>
        <tr class='row_body'>
            <td>Atif-2</td>
            <td>View,Edit,Create</td>
            <td>SuperAdmin</td>
            <td>Yes</td>
            <td>-</td>
            
        </tr> */}
        {tableData.map((value)=>{
          return(
            <tr class={CurrentUser.permissions.edit?'row_body':'row_body unclickable'} >
              <td >{value.name}</td>
              <td>{value.permissions?Object.keys(value.permissions).sort().filter(key => value.permissions[key]).join(' '):'-'}</td>
              <td>{value.superadmin?'SuperAdmin':'Admin'}</td>
              <td ><ReactSwitch
            checked={value.active}
            onChange={(checked)=>handleReactSwitch(checked,value.id)}
            /></td>
              <td>
                {CurrentUser.permissions.edit?<div >
            <img class="pencil_icon" src='../media/icons/pencil.svg' height='22px' width='22px'  onClick={()=>
            { 
              populateUpdateModal(value)
            SetadminToUpdate(value)
            SetUpdatemodalIsOpen(true) 
            }}></img> 
            <img class="trash_icon" src='../media/icons/trash.svg' height='22px' width='22px' onClick={()=>deleteAdmin(value.id)}></img> 
              </div>:<div>-</div>}
              </td>
              
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
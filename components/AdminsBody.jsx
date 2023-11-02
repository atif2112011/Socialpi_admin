import { getAuth, signOut } from 'firebase/auth'
import { QuerySnapshot, addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { database } from '../src/firebaseConfig';
import Modal from 'react-modal'
import { SetLoader } from '../redux/loadersSlice';
import ReactSwitch from 'react-switch';


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

  const updateDB=(userId,payload)=>{

    const Ref = doc(database, "admins", userId);
      
    updateDoc(Ref,payload
      )
      .then((response)=>{
        console.log("Data Updated")
         populateAdmins();
         closeModal();
         
         
         
        })
        .catch((err)=>{
          alert(err.message)
          
        })
        
        
    
  }

  const deleteDB=(userId)=>{
    dispatch(SetLoader(true))
    const Ref = doc(database, "admins", userId);
    deleteDoc(Ref
      )
      .then((response)=>{
        console.log("Data Deleted")
         populateAdmins();
         
         
         
        })
        .catch((err)=>{
          alert(err.message)
          
        })
  }

    const AddAdminButtonAction =()=>{
        console.log('button Clicked')
        SetmodalIsOpen(true)
    } 
   
    const handleFormSubmit=async(event)=>{
    event.preventDefault(); // Prevents the default form submission behavior

  const formData = new FormData(event.target); // 
  var superadmin = formData.get('superadmin'); // Get the value of the 'superadmin' checkbox
  superadmin==null?superadmin=false:superadmin=true

        const UserData={
            name:formData.get('name'),
            email:formData.get('email'),
            superadmin:superadmin,
            active:true,
            permissions:{
              create:false,
              edit:false,
              view:true
            }
            
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

    const handleUpdateFormSubmit=async(event)=>{
      event.preventDefault(); // Prevents the default form submission behavior
  
    const formData = new FormData(event.target); // 
    var superadmin = formData.get('superadmin'); // Get the value of the 'superadmin' checkbox
    superadmin==null?superadmin=false:superadmin=true

    var create = formData.get('create'); // Get the value of the 'superadmin' checkbox
    create==null?create=false:create=true

    var view = formData.get('view'); // Get the value of the 'superadmin' checkbox
    view==null?view=false:view=true

    var edit = formData.get('edit'); // Get the value of the 'superadmin' checkbox
    edit==null?edit=false:edit=true
  
          const UserData={
              name:formData.get('name'),
              email:formData.get('email'),
              superadmin:superadmin,
              permissions:{
                create:create,
                view:view,
                edit:edit
              }

              
          }

          await updateDB(adminToUpdate.id,UserData)
           
          

          
          
          
          
          
  
      }


      const populateUpdateModal=(user)=>{
        document.getElementById('update_admin_name').value='hi'

      }
      

    const handleReactSwitch=async(checked,id)=>{
      dispatch(SetLoader(true))
      
      
      
      const DatatoUpdate={
        active:checked
      }
    await updateDB(id,DatatoUpdate)
    
      
    }
      
    function closeModal() {
    SetmodalIsOpen(false);
    SetUpdatemodalIsOpen(false)
    }


    // const queryDB=async(e)=>{
       
    //     const value=e.target.value;
    //     console.log("Value",value)

    //     const q = query(collectionRef, where("name", "==", `${value}`)); 

    //     try {
    //         const querySnapshot = await getDocs(q);
    //         console.log('Queried Data');
    //         querySnapshot.forEach((doc) => {
    //           console.log(doc.id , " => ", doc.data());
    //         });
    //       } catch (error) {
    //         console.error("Error querying data:", error);
    //       }
    // }

    useEffect(()=>{
        populateAdmins();
       },[])

       var permission='';

  return (
    <div class='flex-col dashboard'>
        <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Add AdminModal"
        className="Modal"
      >
        <h2>Add New Admin</h2>
        <form onSubmit={handleFormSubmit}>
        <div class='flex-col admin_form'>
            <div class>
            <label htmlFor='admin_name'>Admin Name :</label>
            <input class='form_input' type='text' name='name' id='admin_name' required='true'></input>
            </div>

            <div class>
            <label htmlFor='admin_email'>Email :</label>
            <input class='form_input' type='email' name='email' id='admin_email' required='true'></input>
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
            <input class='form_input' type='text' name='name' id='update_admin_name' required='true' placeholder={adminToUpdate.name}></input>
            </div>

            <div class>
            <label htmlFor='email'>Email :</label>
            <input class='form_input' type='email' name='email' id='update_admin_email' required='true' placeholder={adminToUpdate.email}></input>
            </div>

            <div >
              <span>Permissions :</span>
            <div class ='flex permissions_checkboxes'>

              <div class='flex checkbox_div'>
              <label htmlFor='super_admin'>Super Admin :</label>
            <input class='form_input_checkbox'type='checkbox' name='superadmin' id='update_superadmin' ></input>
              </div>

            <div class='flex checkbox_div'>
            <label htmlFor='create'>Create :</label>
            <input class='form_input_checkbox'type='checkbox' name='create' id='update_create'></input>
            </div>

            <div class='flex checkbox_div'>
            <label htmlFor='view'>View :</label>
            <input class='form_input_checkbox'type='checkbox' name='view' id='update_view' ></input>
            </div>


            <div class='flex checkbox_div'>
            <label htmlFor='edit'>Edit :</label>
            <input class='form_input_checkbox'type='checkbox' name='edit' id='update_edit'></input>
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
        onClick={AddAdminButtonAction} disabled={!CurrentUser.permissions.create}
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
              <td>{value.permissions?Object.keys(value.permissions).filter(key => value.permissions[key]).join(' '):'-'}</td>
              <td>{value.superadmin?'SuperAdmin':'Admin'}</td>
              <td ><ReactSwitch
            checked={value.active}
            onChange={(checked)=>handleReactSwitch(checked,value.id)}
            /></td>
              <td>
                {CurrentUser.permissions.edit?<div >
            <img class="pencil_icon" src='../media/icons/pencil.svg' height='22px' width='22px'  onClick={()=>{SetadminToUpdate(value)
            SetUpdatemodalIsOpen(true) 
            populateUpdateModal(value)}}></img> 
            <img class="trash_icon" src='../media/icons/trash.svg' height='22px' width='22px' onClick={()=>deleteDB(value.id)}></img> 
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
import { getAuth, signOut } from 'firebase/auth';
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

function DashMenu() {

  const options=[{
    link:"/dashboard/dashboard",
    name:'Dashboard',
    icon:"../media/icons/dashboard.svg"
  },
  {
    link:"/dashboard/stores",
    name:'Stores',
    icon:"../media/icons/warehouse.svg"
  },
  {
    link:"/dashboard/bills",
    name:'Bills',
    icon:"../media/icons/list.svg"
  },
  {
    link:"/dashboard/admins",
    name:'Admins',
    icon:"../media/icons/admins.svg"
  },
  {
    link:"/dashboard/revenue",
    name:'Revenue',
    icon:"../media/icons/wallet.svg"
  },
  {
    link:"/dashboard/settings",
    name:'Settings',
    icon:"../media/icons/setting.png"
  },
]
  const auth=getAuth();
  const navigate=useNavigate();
  const handleClick=(value)=>{
    setSelectedOption(value);
  }

  const handleLogout=async ()=>{
    await signOut(auth);
    navigate('/');
  }

  return (
    // <div class='flex-col menu'>
    //   <div class="logo">
    //     Logo
    //   </div>
    //   <hr/>
    //   <div class="menu_options">

    //     <ul class="menu_list">
    //       {options.map((value)=>{
    //           return <li 
    //           key={value.name} 
    //           onClick={()=>handleClick(value.name)}
    //           style={{
    //             backgroundColor: value.name === selectedOption ? '#e9ecff' : 'white',
    //             display: 'flex', // Add this line
    //             alignItems: 'center', // Add this line
    //             padding: '8px' // Adjust padding as needed
    //           }}
    //           >
                 
    //           </li>
    //       })}
    //     </ul>

    //   </div>
    //       <div>
    //       <button class="btn-primary-small-text menusignout" onClick={handleLogout}>Sign Out</button>
    //       </div>
      

    // </div>

    // <div>
      // <NavLink to="/dashboard/admins">Component 1</NavLink>
      // <NavLink to="/dashboard/bills">Component 2</NavLink>
    // </div>


    <div class='flex-col menu'>
      <div class="logo">
        <img src="../media/icons/Logo.svg"></img> 
      </div>
      <hr/>
      <div class="menu_options">
      {options.map((value)=>{
        return <NavLink to={value.link}>
        <img src={value.icon} height='20px' width='20px'></img>
        <span >{value.name}</span>
        </NavLink>
      })}
        
        {/* <NavLink to="/dashboard/admins">
        <img src="../media/icons/list.svg" height='20px' width='20px'></img>
        <span >Admins</span>
        </NavLink>

       <NavLink to="/dashboard/bills">
        <img src="../media/icons/admins.svg" height='20px' width='20px'></img><span >Bills</span>
        </NavLink> */}
        

      </div>
          <div>
          <button class="btn-primary-small-text menusignout" onClick={handleLogout}>Sign Out</button>
          </div>
      

    </div>
  )
}

export default DashMenu
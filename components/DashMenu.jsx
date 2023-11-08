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


    <div class='flex-col menu'>
      <div>
      <div class="flex logo">
        <img src="../media/icons/Logo.svg"></img> 
        <button class="btn-primary-small-icon bell_btn"><img src="../media/icons/bell.svg" height='20px' width='20px'></img></button>
      </div>
      <hr/>
      <div class="menu_options">
      {options.map((value)=>{
        return <NavLink to={value.link}>
        <img src={value.icon} height='20px' width='20px'></img>
        <span >{value.name}</span>
        </NavLink>
      })}
        
       
        

      </div>

      </div>
          <div class='flex menu_signout'>
          <button class="menusignout" onClick={handleLogout}><img src="../media/icons/Logout.svg" height="20" width='20px'></img>Sign Out</button>
          </div>
      

    </div>
  )
}

export default DashMenu
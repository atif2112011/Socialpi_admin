import { getAuth, signOut } from 'firebase/auth';
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';


function DashMenu() {

  const options=[{
    link:"/dashboard/dashboard",
    name:'Dashboard',
    icon:"https://firebasestorage.googleapis.com/v0/b/fir-frontend-8cae2.appspot.com/o/icons%2Fdashboard.svg?alt=media&token=faa40991-2f12-4d74-8029-f8c70f0be94f"
  },
  {
    link:"/dashboard/stores",
    name:'Stores',
    icon:"https://firebasestorage.googleapis.com/v0/b/fir-frontend-8cae2.appspot.com/o/icons%2Fwarehouse.svg?alt=media&token=dc0eab20-2a27-4b5a-8ba7-1d829feb52db"
  },
  {
    link:"/dashboard/bills",
    name:'Bills',
    icon:"https://firebasestorage.googleapis.com/v0/b/fir-frontend-8cae2.appspot.com/o/icons%2Flist.svg?alt=media&token=dcba96bb-3ed2-40ec-8fec-3163112be0b9"
  },
  {
    link:"/dashboard/admins",
    name:'Admins',
    icon:"https://firebasestorage.googleapis.com/v0/b/fir-frontend-8cae2.appspot.com/o/icons%2Fadmins.svg?alt=media&token=be964650-7db4-4f7c-a2aa-b54f0a1729d1"
  },
  {
    link:"/dashboard/revenue",
    name:'Revenue',
    icon:"https://firebasestorage.googleapis.com/v0/b/fir-frontend-8cae2.appspot.com/o/icons%2Fwallet.svg?alt=media&token=c59766d2-6c7d-4852-8f18-f93552294a99"
  },
  {
    link:"/dashboard/settings",
    name:'Settings',
    icon:"https://firebasestorage.googleapis.com/v0/b/fir-frontend-8cae2.appspot.com/o/icons%2Fsetting.png?alt=media&token=8cb6c051-6d32-48cf-b97b-f502857e6ab0"
  },
]
  const auth=getAuth();
  const navigate=useNavigate();

  

  const handleLogout=async ()=>{
    await signOut(auth);
    navigate('/');
  }

  return (


    <div class='flex-col menu'>
      <div>
      <div class="flex logo">
        <img src="../media/icons/Logo.svg" class="menu_logo"></img> 
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
          <button class="menusignout" onClick={handleLogout}><img src="../media/icons/Logout.svg" height="20" width='20px' ></img>Sign Out</button>
          </div>
      

    </div>
  )
}

export default DashMenu

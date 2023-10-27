import { getAuth, signOut } from 'firebase/auth';
import React from 'react'
import { useNavigate } from 'react-router-dom';

function DashMenu({selectedOption,setSelectedOption}) {

  const options=[{
    name:'Dashboard',
    icon:"../media/icons/dashboard.svg"
  },
  {
    name:'Stores',
    icon:"../media/icons/warehouse.svg"
  },
  {
    name:'Bills',
    icon:"../media/icons/list.svg"
  },
  {
    name:'Admins',
    icon:"../media/icons/admins.svg"
  },
  {
    name:'Revenue',
    icon:"../media/icons/wallet.svg"
  },
  {
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
      <div class="logo">
        Logo
      </div>
      <hr/>
      <div class="menu_options">

        <ul class="menu_list">
          {options.map((value)=>{
              return <li 
              key={value.name} 
              onClick={()=>handleClick(value.name)}
              style={{
                backgroundColor: value.name === selectedOption ? '#e9ecff' : 'white',
                display: 'flex', // Add this line
                alignItems: 'center', // Add this line
                padding: '8px' // Adjust padding as needed
              }}
              >
                <img class="menu_icon" src={value.icon} height='20px' width='20px'></img> 
                {value.name} 
              </li>
          })}
        </ul>

      </div>
          <div>
          <button class="btn-primary-small-text menusignout" onClick={handleLogout}>Sign Out</button>
          </div>
      

    </div>
  )
}

export default DashMenu
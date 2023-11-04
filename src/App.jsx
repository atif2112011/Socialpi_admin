import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import './App.css'
import Samplebuttons from '../components/Samplebuttons'
import Maindash from './../components/MaindashNew';
import Mainmenu from '../components/DashMenu'
import Spinner from '../components/Spinner'
import Login from '../components/LoginNew';
import DashBody from '../components/DashBody';
import AdminsBody from '../components/menu-routes/AdminsBody';
import BillsBody from '../components/menu-routes/BillsBody';
import DashboardBody from '../components/menu-routes/DashboardBody';
import StoresBody from '../components/menu-routes/StoresBody';
import RevenueBody from '../components/menu-routes/RevenueBody';
import SettingsBody from '../components/menu-routes/SettingsBody';


function App() {
  const {loading} =useSelector((state)=>state.loaders)

  
  

  return (
  //  <Samplebuttons/>
  
  <BrowserRouter>
  {loading && <Spinner/>}
    <Routes>
      <Route path="/" element={<Login/>}>
        
      </Route>
      <Route path="/dashboard" element={<Maindash/>}>
        <Route path="/dashboard/admins" element={<AdminsBody />}/>
        <Route path="/dashboard/bills" element={<BillsBody/>}/>
        <Route path="/dashboard/dashboard" element={<DashboardBody/>}/>
        <Route path="/dashboard/stores" element={<StoresBody/>}/>
        <Route path="/dashboard/revenue" element={<RevenueBody/>}/>
        <Route path="/dashboard/settings" element={<SettingsBody/>}/>
      <Route/>


        
      </Route>
    </Routes>
    </BrowserRouter>


 
  )
}

export default App

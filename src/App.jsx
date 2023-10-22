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
        
      </Route>
    </Routes>
    </BrowserRouter>


 
  )
}

export default App

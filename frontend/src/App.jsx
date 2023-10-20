import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Samplebuttons from '../components/Samplebuttons'
import Maindash from './../components/Maindash';
import Mainmenu from '../components/Mainmenu'

function App() {


  return (
  //  <Samplebuttons/>
  <div class='flex'>
   
    <Mainmenu/>
    <Maindash/>

  </div>
  )
}

export default App

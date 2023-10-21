import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Samplebuttons from '../components/Samplebuttons'
import Maindash from './../components/Maindash';
import Mainmenu from '../components/Mainmenu'
import Spinner from '../components/Spinner'

function App() {
  const [loader,setLoader]=useState(false)


  return (
  //  <Samplebuttons/>
  <div class='flex'>
    {loader && <Spinner/>}
    <Mainmenu setLoader={setLoader}/>
    <Maindash setLoader={setLoader}/>

  </div>
  )
}

export default App

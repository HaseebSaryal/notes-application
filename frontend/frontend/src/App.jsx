import React from 'react'
import {Routes, Route} from 'react-router'
import HomePage from './Pages/HomePage'
import CreatePage from './Pages/CreatePage'
import NoteDetails from './Pages/NoteDetails'
import toast from 'react-hot-toast'
import Navbar from './components/Navbar'

const App = () => {
  return (
<div data-theme = 'forest'>

    <Routes>
      <Route path='/' element = {<HomePage/>}/>
      <Route path='/create' element = {<CreatePage/>}/>
      <Route path='/note/:id' element = {<NoteDetails/>}/>
    </Routes>
</div>
  )
}

export default App
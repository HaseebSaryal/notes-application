import React from 'react'
import {Routes, Route} from 'react-router'
import HomePage from './Pages/HomePage'
import CreatePage from './Pages/CreatePage'
import NoteDetails from './Pages/NoteDetails'
import Navbar from './components/Navbar'
import NoteView from './Pages/NoteView'
import NotFound from './Pages/NotFound'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'

const App = () => {
  return (
<div data-theme = 'forest' className='min-h-screen bg-base-200 text-base-content'>
    <Navbar />
    <Routes>
      <Route path='/' element = {<HomePage/>}/>
      <Route path='/create' element = {<CreatePage/>}/>
      <Route path='/login' element = {<LoginPage/>}/>
      <Route path='/register' element = {<RegisterPage/>}/>
      <Route path='/note/:id' element = {<NoteDetails/>}/>
        <Route path="/view/:id" element={<NoteView />} /> {/* NEW */}
      <Route path='*' element = {<NotFound/>}/>
    </Routes>
</div>
  )
}

export default App

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import ProjectName from './Pages/ProjectName'
import Login from './Pages/Auth/Login'
import Signup from './Pages/Auth/Signup'
import Contactus from './Pages/Contactus'

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<ProjectName />}></Route>
          <Route path='login' element={<Login />}></Route>
          <Route path='register' element={<Signup />}></Route>
          <Route path='contactus' element={<Contactus />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import ProjectName from './pages/ProjectName'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Contactus from './pages/Contactus'

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

import React from 'react'
import './App.css'
import ProjectName from './Pages/ProjectName'
import Login from './Pages/Auth/Login'
import Signup from './Pages/Auth/Signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<ProjectName />}></Route>
          <Route path='register' element={<Signup />}></Route>
          <Route path='login' element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

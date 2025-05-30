import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
// import ProjectName from './pages/ProjectName'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import VerifyCode from './pages/VerifyCode'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'
import Alerts from './pages/Alerts'
import Cameras from './pages/Cameras'
import Contactus from './pages/Contactus'
import { ToastProvider } from "./components/ToastContext";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
            {/* <Route path='/' element={<ProjectName />}></Route> */}
            <Route path='/' element={<Login />}></Route>
            <Route path='register' element={<Signup />}></Route>
            <Route path='forgotpassword' element={<ForgotPassword />}></Route>
            <Route path='verifycode' element={<VerifyCode />}></Route>
            <Route path='resetpassword' element={<ResetPassword />}></Route>
            <Route path='profile' element={<Profile />}></Route>
            <Route path='dashboard' element={<Dashboard />}></Route>
            <Route path='alerts' element={<Alerts />}></Route>
            <Route path='cameras' element={<Cameras />}></Route>
            <Route path='contactus' element={<Contactus />}></Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App

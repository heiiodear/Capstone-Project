import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
// import ProjectName from './pages/ProjectName'
import Login from './Pages/Login.jsx'
import Signup from './Pages/Signup.jsx'
import ForgotPassword from './Pages/ForgotPassword.jsx'
import VerifyCode from './Pages/VerifyCode.jsx'
import ResetPassword from './Pages/ResetPassword.jsx'
import Profile from './Pages/Profile.jsx'
import Dashboard from './Pages/Dashboard.jsx'
import Alerts from './Pages/Alerts.jsx'
import Cameras from './Pages/Cameras.jsx'
import Contactus from './Pages/Contactus.jsx'
import { ToastProvider } from "./components/ToastContext.jsx";

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

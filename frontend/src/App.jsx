import React from 'react'
import './App.css'
import HomePage from './pages/HomePage.jsx'
import ProblemPage from './pages/ProblemPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AuthPage from './pages/authPage.jsx'
import { Routes, Link, Route } from 'react-router-dom'

function App() {
  
  return (
    <>
          <nav>
            <Link to='/'>Home </Link>
            <Link to='/auth'>Login/Register</Link>
          </nav>
          <Routes>
            <Route path='/' element={<HomePage/>} />
            <Route path='/ProblemPage/:problem_id' element={<ProblemPage/>} />
            <Route path='/auth' element={<AuthPage/>}/>
            <Route path='/auth/register' element={<RegisterPage/>}/>
            <Route path='/auth/login' element={<LoginPage/>}/>
          </Routes>
    </>
  );
}

export default App

import React from 'react'
import './App.css'
import HomePage from './pages/HomePage.jsx'
import ProblemPage from './pages/ProblemPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AuthPage from './pages/authPage.jsx'
import RoomsPage from './pages/RoomsPage.jsx'
import RoomPage from './pages/RoomPage.jsx'
import { Routes, Link, Route } from 'react-router-dom'
import {useAuth}  from './context/AuthContext.jsx';
function App() {
    const { user, logout } = useAuth();
  return (
    <>
          <nav>
            <Link to='/'>Home </Link>
            <Link to='/rooms'>Rooms</Link>
            {!user ? (<Link to='/auth'> Login/Register </Link>) : <button id='logoutBtn' onClick={logout}>Logout</button>}
            
          </nav>
          <Routes>
            <Route path='/' element={<HomePage/>} />
            <Route path='/ProblemPage/:problem_id' element={<ProblemPage/>} />
            <Route path='/auth' element={<AuthPage/>}/>
            <Route path='/auth/register' element={<RegisterPage/>}/>
            <Route path='/auth/login' element={<LoginPage/>}/>
            <Route path='/rooms' element={<RoomsPage/>}/>
            <Route path='/rooms/:roomCode' element={<RoomPage/>}/>
          </Routes>
    </>
  );
}

export default App

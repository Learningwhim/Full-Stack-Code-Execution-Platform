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
                <nav className="nav-root">
        <div className="nav-inner">


          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/rooms" className="nav-link">Rooms</Link>
          </div>

          <div className="nav-auth">
            {!user ? (
              <Link to="/auth" className="nav-btn-outline">Login / Register</Link>
            ) : (
              <button className="nav-btn-solid" onClick={logout}>Logout</button>
            )}
          </div>

        </div>
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

import React from 'react'
import './App.css'
import HomePage from './HomePage.jsx'
import ProblemPage from './ProblemPage.jsx'
import { Routes, Link, Route } from 'react-router-dom'

function App() {
  
  return (
    <>
        <div>
          <nav>
            <Link to='/'>Home</Link>
          </nav>
          <Routes>
            <Route path='/' element={<HomePage/>} />
            <Route path='/ProblemPage/:problem_id`' element={<ProblemPage/>} />
          </Routes>
        </div>
    </>
  );
}

export default App

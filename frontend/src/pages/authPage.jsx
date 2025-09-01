import React from 'react'
import { Link } from 'react-router-dom'
export default function AuthPage() {


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome</h1>
        <p className="auth-subtitle">Choose an option to continue</p>

        <Link className='login-button' to='/auth/login'>Login</Link>
        <Link className='register-button' to='/auth/register'>Register</Link>
      </div>
    </div>
  );
}

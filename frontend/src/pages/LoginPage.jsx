import {useState, useEffect} from 'react'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom';
function LoginPage(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const handleLoginSubmit = async (event) => {
        try {
            event.preventDefault();
            setIsLoading(true);
            setError(null);
            
            const response = await fetch('http://localhost:3000/auth/login', {
                method: "POST",
                headers: {"Content-type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            
            if(!response.ok){
                
                const errorData = await response.json();
                setError(errorData.message);
            }else{
            const data = await response.json();
            const token = data.token;
            localStorage.setItem('authToken', token);
            console.log("Login Succesfull")
            alert("Login Succesfull");
            navigate('/');
            }
        }catch(error){
            alert("Login Unsuccesfull");
            setError("Login failed. Please try again later");
        }finally{
            setIsLoading(false);
        }
    }
    return (
        <div className="auth-container">
        <div className="auth-card">
            <h1 className="auth-title">Login</h1>
  <form onSubmit={handleLoginSubmit} className="auth-form">
    <input
      placeholder="Email"
      className="auth-input add-small"
      type="email"
      required
      onChange={(e) => setEmail(e.target.value)}
      value={email}
    />
    <input
      placeholder="Password"
      className="auth-input add-small"
      type="password"
      required
      onChange={(e) => setPassword(e.target.value)}
      value={password}
    />
    <button id='login-button' type="submit">Login</button>
    <h3>Demo Credentials</h3>
    <p>abc@gmail.com</p>
    <p>1234</p>
  </form>
</div>
</div>

    );
}

export default LoginPage;

import {useState, useEffect} from 'react'
import Button from '../components/Button'

function RegisterPage(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleRegisterSubmit = async (event) => {
        try {
            event.preventDefault();
            setIsLoading(true);
            setError(null);
            const response = await fetch('http://localhost:3000/auth/register', {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify({
                    email: email,
                    password: password
                })
                
            });
            if(!response.ok){
                const errorData = await response.json();
                setError(errorData.message);
            }else
            console.log("Resgitration Succesfull")

        }catch(error){
            setError("Resgistration failed. Please try again later")
        }finally{
            setIsLoading(false);
        }
    }
    return (
        <div className="auth-container">
        <div className="auth-card">
            <h1 className="auth-title">Register</h1>
            <form onSubmit={handleRegisterSubmit} className="auth-form">
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
                <button id='register-button' type="submit">Register</button>
            </form>
        </div>
        </div>
    );
}

export default RegisterPage;

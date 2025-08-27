import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
function HomePage() {

    const [problems, setProblems] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        
        const fetchProblems = async () => {
        try {
        const response = await fetch('http://localhost:3000/problems');
        const data = await response.json();
        setProblems(data);
        setLoading(false);
        }catch(error){
            setError("Failed to fetch problems");
        }
    }
        fetchProblems();
    }, []);
    return(
        <>
        <div id="homepage-body">
             
                {
                    isLoading 
                    ? <p className="loading-text">Loading...</p>
                    : error ? (<p className="fetch-error">{error}</p>)
                    : <ul type="none">{
                        problems.map((problem) => (
                        <li key={problem.problem_id}><Link to={`/ProblemPage/${problem.problem_id}`}>{problem.problem_id}. {problem.title}</Link></li>
                    ))}
                    </ul>
                }
             
        </div>
        </>
    );
}

export default HomePage;
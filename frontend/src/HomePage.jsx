import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
function HomePage() {

    const [problems, setProblems] = useState([]);
    const [problem_title, setProblemTitle] = useState(null);
    const [problem_statement, setProblemStatement] = useState(null);
    const [problem_time_limit, setProblemTL] = useState(null);
    const [problem_memory_limit, setProblemML] = useState(null);
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

    const handleProblemSubmit = async () => {
        const problem = {
            title: problem_title,
            statement: problem_statement,
            time_limit: problem_time_limit,
            memory_limit: problem_memory_limit
        }
        try {
            const response = await fetch("http://localhost:3000/add-problem", {
                method: "POST",
                headers: {"Content-type":"application/json"},
                body: JSON.stringify(problem),
            });
            const data = await response.json();
            setProblems(prev => [...prev, data]);
        }catch(error){
            console.error("Unable to add problem", error);
        }
    }
    return(
        <div id="homepage-body">
            <div id="problems-body">
                
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
            <div id="addproblem-body">
                <input className="addproblem-title" type="text" placeholder="title" onChange = {(e) => setProblemTitle(e.target.value)}/>
                <input className="addproblem-statement" type="text" placeholder="description" onChange={(e) => setProblemStatement(e.target.value)}/>
                <input className="addproblem-time-limit" type="integer" placeholder="time limit" onChange={(e) => setProblemTL(e.target.value)}/>
                <input className="addproblem-memory-limit" type="integer" placeholder="memory limit" onChange={(e) => setProblemML(e.target.value)}/>
                <button id="submitProblem" onClick={handleProblemSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default HomePage;
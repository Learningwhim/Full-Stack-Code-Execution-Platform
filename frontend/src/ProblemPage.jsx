import { useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function ProblemPage() {

    const [problem, setProblem] = useState((null));
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("cpp");
    const { problem_id } = useParams();
    useEffect(() => {
        
            const fetchProblem = async() => {
            try {
                const response = await fetch(`http://localhost:3000/problems/${problem_id}`);
                const data = await response.json();
                setProblem(data);
                setLoading(false);
            }catch(error){
                setError("Failed to fetch Problem");
            }
            }
            fetchProblem();
        
        
    }, [problem_id]);
    
    

    const handleSubmit = async (code) => {
        const submission = {
        problem_id: problem.problem_id,
        user_id: "Guest",
        code: code,
        language: language,
        status: status,
    }
        try{
            
            const response = await fetch('http://localhost:3000/submit', {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify(submission),
            });
            const data = response.json();
            const submission_id = data.submission_id;
            async function pollStatus(submission_id){
                const response = await fetch(`http://localhost:3000/status/${submission_id}`);
                const data = await response.json();
                const newStatus = data.status;

                setStatus(newStatus);
            }
            
            const intervalId = setInterval(() => pollStatus(submission_id),1000);
            if (status !== "Pending" && status !== "In Progress") {
                clearInterval(intervalId); // Stop polling for ANY final status
            }
        }catch(err){
            console.error(err);
        }
    }


    return(
        <>
            <div className="problems-page-body">
                <div className="problems-container">
                {
                    isLoading ? (<p className="Loading">Loading...</p>)
                    : error ? (<p className="fetch-error">{error}</p>)
                    : 
                        <header>
                            <h3 className="problem-title" value={problem.title}>{problem.problem_id}. {problem.title}</h3>
                            <p className="problem-description" value={problem.description}>Problem Description: {problem.statement}</p>
                        </header>
                    
                }
                </div>
                <div className="submission-container">
                {/* Add this wrapper div */}
                <div className="submission-header">
                    <button className="submit" onClick={() => handleSubmit(code)}>
                    Submit
                    </button>
                    <p className='status'>Status: {status}</p>
                    <select>
                    <option label="cpp">cpp</option>
                    </select>
                </div>

                {/* The textarea now correctly fills the remaining space */}
                <textarea 
                    className="submitted-code-input" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)}
                />

                </div>
            </div>
        </>
    );
}

export default ProblemPage;
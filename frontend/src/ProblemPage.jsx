import { useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function ProblemPage() {

    const [problem, setProblem] = useState((null));
    const [isLoading, setLoading] = useState(true);
    const [submissionId, setSubmissionId] = useState();
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("Pending");
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
    
    

    const handleSubmit = async () => {
        setStatus("Pending");
        const submission = {
        problem_id: problem_id,
        user_id: "Guest",
        code: code,
        language: language,
    }
        try{
            setStatus("Submitting...");
            const response = await fetch('http://localhost:3000/submit', {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify(submission),
            });
            const data = await response.json();
            setSubmissionId(data.submission_id);
        }catch(err){
            console.error(err);
        }
    }
    useEffect( () => {
        if(!submissionId) return;
        
        const intervalId = setInterval(async () => {
            const response = await fetch(`http://localhost:3000/status/${submissionId}`);
            const data = await response.json();
            const newStatus = data.status;
            console.log(newStatus);
            setStatus(newStatus);
            if( newStatus !== "Pending" && newStatus !== "In Progress"){
            clearInterval(intervalId);
            }
        }, 1000);
        return () => clearInterval(intervalId);
    },[submissionId]);

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
                <div className="submission-header">
                    {
                    status == "Submitting..."? (<button className="submit">
                    Submitting...
                    </button>)
                    : (<button className="submit" onClick={() => handleSubmit}>
                    Submit
                    </button>)
                    }
                    <p className='status'>Status: {status}</p>
                    <select>
                    <option label="cpp">cpp</option>
                    </select>
                </div>
                <textarea 
                    className="submitted-code-input" 
                    id="submitted-code-input" 
                    placeholder='Start typing...'
                    value={code}
                    onChange={(e) => {setCode(e.target.value)
                    }}
                />

                </div>
            </div>
        </>
    );
}

export default ProblemPage;
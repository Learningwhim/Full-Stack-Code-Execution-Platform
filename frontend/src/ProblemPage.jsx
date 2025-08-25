import { useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

function ProblemPage() {

    const [problem, setProblem] = useState((null));
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("Pending");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("cpp");

    useEffect(() => {
        try{
            const fetchProblem = async() => {
            const { problem_id } = useParams();
            const response = await fetch(`http://localhost:3000/problems/${problem_id}`);
            const data = await response.json();
            setProblem(data);
            setLoading(false);
        }
        fetchProblem();
        }catch(error){

        }
        
    }, []);
    
    const submission = {
        problem_id: problem.problem_id,
        user_id: "Guest",
        code: code,
        language: language,
        status: status,
    }

    const handleSubmit = async (code) => {
    try{
        const response = await fetch('http://localhost:3000/submit', {
        method: "POST",
        headers: {"Content-type":"application/json"},
        body: JSON.stringify(submission),
    });
    async function pollStatus(submission_id){
        const response = await fetch(`http://localhost:3000/status/${submission_id}`);
        const data = response.json();
        const newStatus = data.status;

        setStatus(newStatus);
        return updatedStatus;
    }
    
    setInterval(pollStatus,1000);
    if (newStatus !== "Pending" && newStatus !== "In Progress") {
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
                    <header>
                        <h3 className="problem-title" value={problem.title}>title</h3>
                    </header>
                </div>
                <div className="submission-container">
                    <select>
                        <option label="cpp">cpp</option>
                    </select>
                    <p className='status'>{status}</p>
                    <input type="text" className="submitted-code" value={code} onChange={(e) => setCode(e.target.value)}/>
                    <button className="submit" onClick={() => handleSubmit(code)}></button>
                </div>
            </div>
        </>
    );
}

export default ProblemPage;
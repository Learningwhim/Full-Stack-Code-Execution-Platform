
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

function RoomPage() {
    const [isLoading, setLoading] = useState(true);
    const [submissionId, setSubmissionId] = useState();
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("Pending");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("cpp");
    const { roomCode } = useParams();
    const [roomData, setRoomData] = useState(null);
    const [ currProblemIndex, setCurrentProblemIndex] = useState(0);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
            const fetchRoomData = async() => {
            try { 
                
                const response = await fetch(`http://localhost:3000/rooms/${roomCode}`,{
                    method: "GET",
                    headers: {"Authorization": `Bearer ${token}`,
                              "Content-Type": "application/json"}
                });
                const data = await response.json();
                setRoomData(data);
                console.log(data);
                setLoading(false);
            }catch(error){
                setError("Failed to fetch roomData");
                }
            }
            fetchRoomData();
        
        
    }, [roomCode, token]);
    //const currentProblem = null;
    //if(roomData !== null) currentProblem = roomData.problems[currentProblemIndex];
    

    const handleSubmit = async () => {
        setStatus("Pending");
        const submission = {
        problem_id: problem_id,
        code: code,
        language: language,
    }
        try{
            setStatus("Submitting...");
            const token = localStorage.getItem('authToken');
            const response = await fetch(`http://localhost:3000/submit`, {
            method: "POST",
            headers: {"Content-type":"application/json",
                        "Authorization": `Bearer ${token}`
            },
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
                            <button onClick={handlePrev}>prev</button>
                            <button onClick={handleNext}>next</button>
                            <h3 className="problem-title" value={problem.title}>{problem.problem_id}. {problem.title}</h3>
                            <p className="problem-description" value={problem.description}>Problem Description: {problem.statement}</p>
                            <p>#include {`<iostream>`}</p>
                            <p>using namespace std;
                            {`\nint main(){\n\t  return 0;\n }`}</p>
                            <br/>
                            
                        </header>
                        
                    
                }
                </div>
                <div className="submission-container">
                <div className="submission-header">
                    {
                    status == "Submitting..."? (<button className="submit">
                    Submitting...
                    </button>)
                    : (<button className="submit" onClick={handleSubmit}>
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
    </>);
}
export default RoomPage
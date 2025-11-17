
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';
import { useAuth } from '../context/AuthContext';

function RoomPage() {
    const user = useAuth();
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
    const [roomProblems, setRoomProblems] = useState([]);
    const [roomParticipants, setRoomParticipants] = useState([]);
    const [sidebar, setSidebar] = useState(false);
    const [ProblemLength, setProblemLength] = useState(0);
    useEffect(() => {
        if(!roomCode || !token) return;
            const fetchRoomData = async() => {
            try { 

                const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms/${roomCode}`,{
                    method: "GET",
                    headers: {"Authorization": `Bearer ${token}`,
                              "Content-Type": "application/json"}
                });
                const data = await response.json();
                setRoomData(data.roomDetails);
                setRoomProblems(data.room_problems);
                setProblemLength(roomProblems.length);
                setRoomParticipants(data.room_participants);
                console.log(data);
                setLoading(false);
            }catch(error){
                setError("Failed to fetch roomData");
                console.log(error);
                }
            }
            fetchRoomData();
        
        
    }, [roomCode, token]);
    //const currentProblem = null;
    //if(roomData !== null) currentProblem = roomData.problems[currentProblemIndex];
    const handleNext = async () => {
        try{
            const totalProblems = roomProblems.length;
            console.log(currProblemIndex);
            if(currProblemIndex >= totalProblems)  setCurrentProblemIndex(0);
            else setCurrentProblemIndex(currProblemIndex+1);
            console.log(currProblemIndex);
        }catch(error){
            console.error("handle next problem occured");
        }
    }
    const handlePrev = async () => {
        try{
            console.log(currProblemIndex);
            if(currProblemIndex <= 0)  return;
            else setCurrentProblemIndex(currProblemIndex-1);
            console.log(currProblemIndex);
        }catch(error){
            console.error("handle next problem occured");
        }
    }

    const handleSubmit = async () => {
        setStatus("Pending");
        const current_problem = roomProblems[currProblemIndex];
        const submission = {
        problem_id: current_problem.problem_id,
        code: code,
        language: language,
        roomCode: roomCode,
    }
        try{
            setStatus("Submitting...");
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/submit`, {
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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/status/${submissionId}`);
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
    useEffect( () => {
        try {
            const socket = io(import.meta.env.VITE_API_URL);
            
            socket.emit("join-room", { roomCode : roomCode, user_id : user?.id });

            return () => {
                socket.disconnect();
            }
        }catch(error){

        }
    },[roomCode, user]);
    return(
    <>
    <div className="problems-page-body">
                <div className="problems-container">
                    <button className="leaderboardOpen" onClick={() => setSidebar(!sidebar)}>
                        {'<<'}
                    </button>

                    <div className={`sidebar ${sidebar ? "open" : ""}`}>
                        <br/>
                            <button id="sidebarHeader"onClick={() => setSidebar(!sidebar)}>
                                <p id="closeSidebar">❌</p>
                            </button>
                            <Leaderboard participants={roomParticipants}/>
                    </div>
                {
                    isLoading ? (<p className="Loading">Loading...</p>)
                    : error ? (<p className="fetch-error">{error}</p>)
                    : 
                        <header>
                            <button className="togglebtn" onClick={handlePrev}>{'< prev'}</button>
                            <button className="togglebtn" onClick={handleNext}>{' next >'}</button>
                            {(roomProblems) ? <h3 className="problem-title" value={currProblemIndex}>{currProblemIndex+1}. {roomProblems[currProblemIndex].title}</h3> : <h3>loading</h3>}
                            {(roomProblems) ? <p className="problem-description" value={roomProblems[currProblemIndex].description}>Problem Description: {roomProblems[currProblemIndex].statement}</p> : <p>loading</p>}
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
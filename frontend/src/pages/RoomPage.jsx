
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';
function RoomPage() {
    const {user} = useAuth();
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
    const [ProblemLength, setProblemLength] = useState();
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
                setProblemLength(data.room_problems);
                console.log(roomProblems.length);
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
    const handleNext = async () => {
        try{
            console.log(currProblemIndex);
            setCurrentProblemIndex( prev => {
              if( prev >= roomProblems.length-1) return prev;
              return prev+1;
            });
        }catch(error){
            console.error("handle next problem occured");
        }
    }
    const handlePrev = async () => {
        try{
            console.log(currProblemIndex);
            setCurrentProblemIndex( prev => {
              if( prev <= 0) return prev;
              return prev-1;
            })
            //console.log(currProblemIndex);
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
    let count  = 0;
    useEffect( () => {
        try {
            if (!user) {
                return; 
            }
            const socket = io(`${import.meta.env.VITE_API_URL}`,  {
                transports: ["websocket"]});
            socket.emit("join-room", { roomCode : roomCode, user_id : user?.user_id });
                console.log("hello world");
            socket.on("connect_error", () => {
                console.log("Reconnect attempt…");
                socket.connect();
            });
            
            socket.on('leaderboardUpdate', (newLeaderboardData) => {
                console.log("Leaderboard update received!");
                setRoomParticipants(newLeaderboardData);
            });
            return () => {
                socket.disconnect();
            }
        }catch(error){
            console.error("SOCKET ERROR HERE");
        }
    },[roomCode, user]);
    return(
    <>
    {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
          <div className="room-body">
        <div className="room-left">

          <button
            className="leaderboard-toggle-btn"
            onClick={() => setSidebar(!sidebar)}
          >
            {'View Live Rankings'}
          </button>

          <div className={`room-sidebar ${sidebar ? "open" : ""}`}>
            <button
              className="room-sidebar-close"
              onClick={() => setSidebar(false)}
            >
              ✖
            </button>
            <Leaderboard participants={roomParticipants} />
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <>
              <div className="room-nav-buttons">
                <button className="room-nav-btn" onClick={handlePrev}>{'< prev'}</button>
                <button className="room-nav-btn" onClick={handleNext}>{'next >'}</button>
              </div>

              {roomProblems[currProblemIndex] && (<>
              <h3 className="room-problem-title">
                {currProblemIndex + 1}. {roomProblems[currProblemIndex].title}
              </h3>
              <p className="room-problem-desc">
                {roomProblems[currProblemIndex].statement}
              </p>
              </>
              )}

              <pre>
                  {`#include <iostream>
                  using namespace std;

                  int main() {
                      return 0;
                  }`}
              </pre>
            </>
          )}
        </div>

        <div className="room-right">
          <div className="room-editor-header">
            {status === "Submitting..." ? (
              <button className="room-submit-btn">Submitting...</button>
            ) : (
              <button className="room-submit-btn" onClick={handleSubmit}>Submit</button>
            )}

            <p className="room-status">Status: {status}</p>

            <select
              className="room-lang-select"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              <option value="cpp">cpp</option>
            </select>
          </div>

          <div className="room-editor-box">
            <Editor
              language="cpp"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
            />
          </div>
        </div>
      </div>

    </>);
}
export default RoomPage
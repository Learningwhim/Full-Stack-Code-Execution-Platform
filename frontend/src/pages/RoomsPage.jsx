import { useState, useEffect } from "react";
import "./roompage.css";
import { useNavigate } from "react-router-dom";

function RoomsPage() {

    const [problems, setProblems] = useState([]);
    const [problemIds, setProblemIds] = useState([]);
    const [error, setError] = useState(null);
    const [roomCode, setRoomCode] = useState();
    const [activeTab, setActiveTab] = useState("join");
    const navigate = useNavigate();
    useEffect( () => {
      const fetchProblems = async () => {
      try{ 
        const response = await fetch(`${import.meta.env.VITE_API_URL}/problems`);
        const data = await response.json();
        setProblems(data);
      }catch(error){
        console.error("failed to fetch problems");
      }
    }
    fetchProblems();
    },[]);

    const handleChangeCheckbox = (problem_id) => {
      if(problemIds.includes(problem_id)){
        setProblemIds(problemIds.filter((x) => x !== problem_id))
      }else{
        setProblemIds([...problemIds,problem_id]);
      }
    }

    async function handleJoinRoom() {
      try{
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms/join`, {
          method: 'POST',
          headers: {'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({roomCode})
        });
        if(response.ok)
          navigate(`/rooms/${roomCode}`);
        else {
          const errorData = await response.json();
          setError(errorData.error);
          throw new Error(errorData.error);
        }
      }catch(err){
        console.error(err);
      }
    }

    async function handleCreateRoom() {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms/create`, {
          method: "POST",
          headers: {"Content-type":"application/json",
                        "Authorization": `Bearer ${token}`
            },
          body: JSON.stringify({problemIds: problemIds})
        });
        const {room_code} = await response.json();
        console.log(room_code);
        setRoomCode(room_code);
        navigate(`/rooms/${room_code}`);
      }catch(error){
        console.error("failed to create request");
      }
    }
    return (
    <div className="rooms-page">
        <div className="tab-toggle">
            <button className='toggle-buttons' onClick={() => setActiveTab('join') }>Join Room</button>
            <button className='toggle-buttons' onClick={() => setActiveTab('create')}>Create Room</button>
            {activeTab === 'create' &&(
                <section className="section create-room">
            <h2>Create Room</h2>
            <p>Select questions to include in the room:</p>
            <div className="question-list">
              <ul type="none">{problems.map((problem) => (
                <li key={problem.problem_id} > 
                  <input 
                  type="checkbox" 
                  checked={problemIds.includes(problem.problem_id)}
                  onChange={() => handleChangeCheckbox(problem.problem_id)}>
                </input>{problem.problem_id} {problem.title}</li>
              ))}</ul>
            </div>
            <div className="actions">
              <button onClick={handleCreateRoom} className="btn btn-primary">
                Create Room
              </button>
              <span>{problemIds.length} selected</span>
            </div>
          </section>
          )}
            {activeTab === 'join' &&(
                <section className="section join-room">
            <h2>Join Room</h2>
            <p>Enter a room code to join an existing room:</p>
            <input
              type="text"
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="ABC123"
              maxLength={8}
              className="input-code"
            />
            <div className="actions">
              <button onClick={handleJoinRoom} className="btn btn-outline">
                Join Room
              </button>
              <button
                onClick={() => {
                  navigator.clipboard && navigator.clipboard.writeText(roomCode);
                  alert("Room code copied to clipboard (if supported)");
                }}
                className="btn btn-ghost">
                Copy Code
              </button>
            </div>
            <p className="tip">
              Tip: If you are creating a room, share the generated code with participants so they can join.
            </p>
          </section>
        )}
        </div>
    </div>
  );
}

export default RoomsPage;



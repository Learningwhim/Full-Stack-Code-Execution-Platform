import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
function HomePage() {

    const [problems, setProblems] = useState([]);
    const [problem_title, setProblemTitle] = useState(null);
    const [problem_statement, setProblemStatement] = useState(null);
    const [problem_time_limit, setProblemTL] = useState(null);
    const [problem_memory_limit, setProblemML] = useState(null);
    const [testcaseId, setTestcaseId] = useState(null);
    const [testcaseInp, setTestcaseInp] = useState(null);
    const [testcaseEO, setTestcaseEO] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        
        const fetchProblems = async () => {
        try {
        const response = await fetch(`http://localhost:3000/problems`);
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
            console.log("recieved req call fe");
            const response = await fetch(`http://localhost:3000/add-problem`, {
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
    const handleTestcaseSubmit = async () => {
        try {
            const testcase = {
                problem_id: testcaseId,
                input: testcaseInp,
                expected_output: testcaseEO,
            }
            await fetch("http://localhost:3000/addTestcase",  {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(testcase),
            });
        }catch(error){
            console.error("Failed to submit testcase");
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
                    <div className="add-container">
                        <form onSubmit={handleProblemSubmit} id="form-1"> 
                            <h2>Add Problem</h2>       
                        <input 
                            className="add-small" 
                            type="text" 
                            placeholder="title" 
                            required
                            onChange={(e) => setProblemTitle(e.target.value)} 
                        />
                        <input 
                            className="add-medium" 
                            type="text" 
                            placeholder="description" 
                            required
                            onChange={(e) => setProblemStatement(e.target.value)} 
                        />
                        <input 
                            className="add-small" 
                            type="number" 
                            placeholder="time limit (ms)" 
                            required
                            onChange={(e) => setProblemTL(Number(e.target.value))} 
                        />
                        <input 
                            className="add-small" 
                            type="number" 
                            placeholder="memory limit (MB)" 
                            required
                            onChange={(e) => setProblemML(Number(e.target.value))} 
                        />
                        <button id="submitProblem" type="submit">Submit</button>
                        </form>
                    </div>
                    <div className="add-container">
                        <form onSubmit={handleTestcaseSubmit} id="form-2">
                            <h2>Add Testcase</h2>
                            <input  required className="add-small" type="integer" placeholder='problem id' onChange={(e) => setTestcaseId(e.target.value)}/>
                            <input required className="add-small" type="text" placeholder='input' onChange={(e) => setTestcaseInp(e.target.value)}/>
                            <input required className="add-medium" type="text" placeholder='expected output' onChange={(e) => setTestcaseEO(e.target.value)}/>
                            <button id='submitProblem' type="submit">Submit</button>
                        </form>
                    </div>
            </div>
        </div>
    );
}

export default HomePage;
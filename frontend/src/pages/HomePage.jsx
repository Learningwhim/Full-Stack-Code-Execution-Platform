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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/problems`);
        const data = await response.json();
        setProblems(data);
        setLoading(false);
        }catch(error){
            setError("Failed to fetch problems");
        }
    }
        fetchProblems();
    }, []);

    const handleProblemSubmit = async (e) => {
        
        const problem = {
            title: problem_title,
            statement: problem_statement,
            time_limit: problem_time_limit,
            memory_limit: problem_memory_limit
        }
        try {
             e.preventDefault();
            console.log("recieved req call fe");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/problems/add-problem`, {
                method: "POST",
                headers: {"Content-type":"application/json"},
                body: JSON.stringify(problem),
            });
            const data = await response.json();
            console.log(data);
            setProblems(prev => [...prev, data]);
        }catch(error){
            console.error("Unable to add problem", error);
        }
    }
    const handleTestcaseSubmit = async (e) => {
        e.preventDefault();
        try {
            
            console.log("reached here");
            const testcase = {
                problem_id: testcaseId,
                input: testcaseInp,
                expected_output: testcaseEO,
            }
            console.log("reached here 2");
            await fetch(`${import.meta.env.VITE_API_URL}/addTestcase`,  {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(testcase),
            });
            console.log("reached here");
        }catch(error){
            console.error("Failed to submit testcase");
        }
    }
    return (
            <div id="homepage-body">
                {/* LEFT PANEL */}
                <div className="home-problems-panel">
                <h2>Problems</h2>

                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <ul style={{ listStyle: "none" }}>
                    {problems.map((problem) => (
                        <li
                        key={problem.problem_id}
                        className="problem-list-item"
                        >
                        <Link to={`/ProblemPage/${problem.problem_id}`}>
                            {problem.problem_id}. {problem.title}
                        </Link>
                        </li>
                    ))}
                    </ul>
                )}
                </div>

                {/* RIGHT PANEL */}
                <div className="home-form-panel">

                {/* ADD PROBLEM */}
                <form onSubmit={handleProblemSubmit} className="form-card">
                    <h2>Add Problem</h2>

                    <input
                    className="form-input"
                    type="text"
                    placeholder="Title"
                    required
                    onChange={(e) => setProblemTitle(e.target.value)}
                    />

                    <input
                    className="form-input text-big"
                    type="text"
                    placeholder="Description"
                    required
                    onChange={(e) => setProblemStatement(e.target.value)}
                    />

                    <input
                    className="form-input"
                    type="number"
                    placeholder="Time limit (ms)"
                    required
                    onChange={(e) => setProblemTL(Number(e.target.value))}
                    />

                    <input
                    className="form-input"
                    type="number"
                    placeholder="Memory limit (MB)"
                    required
                    onChange={(e) => setProblemML(Number(e.target.value))}
                    />

                    <button type="submit" className="form-submit">
                    Submit
                    </button>
                </form>

                {/* ADD TESTCASE */}
                <form onSubmit={handleTestcaseSubmit} className="form-card">
                    <h2>Add Testcase</h2>

                    <input
                    className="form-input"
                    type="number"
                    placeholder="Problem ID"
                    required
                    onChange={(e) => setTestcaseId(e.target.value)}
                    />

                    <input
                    className="form-input"
                    type="text"
                    placeholder="Input"
                    required
                    onChange={(e) => setTestcaseInp(e.target.value)}
                    />

                    <input
                    className="form-input text-big"
                    type="text"
                    placeholder="Expected Output"
                    required
                    onChange={(e) => setTestcaseEO(e.target.value)}
                    />

                    <button type="submit" className="form-submit">
                    Submit
                    </button>
                </form>

                </div>
            </div>
            );

}

export default HomePage;
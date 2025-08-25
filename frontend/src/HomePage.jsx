import { useState, useEffect } from 'react';

function HomePage() {

    const [problems, setProblems] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3000/problems').then(response => response.json())
                             .then(data => {setProblems(data)});
    }, []);
    return(
        <>
        <div>
             <ul>
                {
                    problems.map((problem) => (
                        <li key={problem.problem_id}><Link to={`/ProblemPage/${problem.problem_id}`}>{problem.problem_id}. {problem.title}</Link></li>
                    ))}
             </ul>
        </div>
        </>
    );
}

export default HomePage;
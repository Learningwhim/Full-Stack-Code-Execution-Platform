const {addProblem, getProblems, getProblemByIdService} = require('../services/problemService');


const getAllProblems =  async (req, res) => {
    console.log("1. Received a request for /problems");
    try {const problems = await getProblems();
    res.json(problems);
    console.log("2. Trying to get problems from DB...");
    }
    catch(error){
        console.error("Error in GET /problems:", error);
        res.status(500).json({error: "Couldn't fetch problems"});
    }
}



//calls the function which adds the provided problem in db
const createProblem = async (req, res) => {
    try {
    const problem = req.body;
    const newProblemId = await addProblem(problem);
    res.json(newProblemId[0]);
    }catch(error){
        res.status(500).json({error: "unable to add problem"});
    }
    
}
const getProblemByIdController =  async (req, res) => {
    try{
    const problem_id = req.params.problem_id; 
    const problem = await getProblemByIdService(problem_id);
    if(problem) 
    res.json(problem);
    else res.status(404).json({error: "Problem not found"});
    }catch(error){
        res.status(500).json({error: "Couldn't fetch problem"});
    }
}

module.exports = {
    getAllProblems,
    createProblem,
    getProblemByIdController
}
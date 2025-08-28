const express = require('express');
const db = require('./database');
const cors = require('cors');
const app = express();
app.use(cors()); // allows all origins
app.use(cors({ origin: 'http://localhost:5173' }));


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/problems/:problem_id', async (req, res) => {
    try{
    const problem_id = req.params.problem_id; 
    const problem = await db('problems').where('problem_id', problem_id).select('*').first();
    if(problem) 
    res.json(problem);
    else res.status(404).json({error: "Problem not found"});
    }catch(error){
        res.status(500).json({error: "Couldn't fetch problem"});
    }
});

app.get('/problems', async (req, res) => {
    try {const problems = await getProblems();
    res.json(problems);}
    catch(error){
        res.status(500).json({error: "Couldn't fetch problems"})
    }
});

async function getProblems(){
    const problems = await db('problems').select('problem_id','title');
    return problems;
}
// this will put up a req in db to fetch status of provided submission
app.get('/status/:submission_id', async (req,res) => {
    try {
    const id = req.params.submission_id;
    const submission = await db('submissions').where({submission_id: id}).select('status').first();
    console.log(submission);
    if(!submission) {
        res.status(404).json({ error: "Submission not found"});
    }
    else res.json(submission);
    }
    catch(error){
        res.status(500).json({error: "Unable to fetch from db"});
    }
});

//calls the function ehich adds submission in db for processing
async function addSubmission(submission) {
    try {
        const result = await db('submissions').insert({
            problem_id: submission.problem_id,
            user_id: submission.user_id,
            code: submission.code,
            language: submission.language,
            status: "Pending",
        }).returning('submission_id'); 
        return result;
    }
    catch(error){
        console.error("server error");
        throw error;
    }
}
    
app.post('/submit', async (req,res) => {
    try {
    const newSubmission = await addSubmission(req.body);
    res.json({submission_id: newSubmission[0].submission_id});
    }
    catch(error){
        res.status(500).json({ error: 'Server error while creating submission'});;
    }
});

async function addProblem(problem){ // inserts problem in db
        try {
            const result = await db('problems').insert({
                title: problem.title,
                statement: problem.statement,
                time_limit: problem.time_limit,
                memory_limit: problem.memory_limit,
            }).returning('*'); return result;
        }
        catch(error){
            console.error("Failed to add problem", error);
            throw error;
        }
}


//calls the function which adds the provided problem in db
app.post('/add-problem', async (req, res) => {
    try {
    const problem = req.body;
    const newProblemId = await addProblem(problem);
    res.json(newProblemId[0]);
    }catch(error){
        res.status(500).json({error: "unable to add problem"});
    }
    
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
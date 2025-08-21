const express = require('express');
const db = require('./database');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// this will put up a req in db to fetch status of provided submission
app.get('/status/:submission_id', async (req,res) => {
    try {
    const id = req.params.submission_id;
    const submission = await db('submissions').where({submission_id: id}).select('status').first();
    }
    catch(error){
        res.status(404).json({error: "Submission not found"});
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
            status: submission.status,
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
                title: problem.problem_id,
                statement: problem.statement,
                time_limit: problem.time_limit,
                memory_limit: problem.memory_limit,
            }).returning('problem_id'); return result;
        }
        catch(error){
            console.error("Failed to add problem");
            throw error;
        }
}


//calls the function which adds the provided problem in db
app.post('/add-problem', async (req, res) => {
    try {
    const problem = req.body;
    const newProblemId = await addProblem(problem);
    res.json({ problem_id: newProblemId[0].problem_id});
    }catch(error){
        res.status(500).json({error: "unable to add problem"});
    }
    
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
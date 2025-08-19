const express = require('express');
const db = require('./database');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// this will put up a req in db to fetch status of provided submission
app.get('/status/:submission_id',(req,res) => {
    const id = req.params.submission_id;
    db.get(`SELECT * FROM submissions WHERE submission_id = ?`, [id], (error, submission) =>{
        if(error) return console.error(error);
        if(!submission) return res.status(404).json({error: "submssion not found"});
        else{
            res.json({status: submission.status});
        }
    });
});

//calls the function ehich adds submission in db for processing
app.post('/submit', (req,res) => {
    const submission = req.body;
    addSubmission(submission);
    res.send("pending...");
})

function addProblem(problem){ // inserts problem in db
        db.run('INSERT INTO problems(problem_id,problem_title,problem_statement,time_limit,memory_limit) VALUES (?,?,?,?,?)',
            [problem.problem_id,problem.problem_title,problem.problem_statement,problem.time_limit,problem.memory_limit], 
        function(error){
            if(error) console.error(error);
            else console.log(`Inserted with id ${this.lastID}`);
        }
    );
}

function addSubmission(submission){
    db.run('INSERT INTO submissions (problem_id,user_id,code,language,status,timestamp) VALUES (?,?,?,?,?,?)',
        [submission.problem_id,submission.user_id,submission.code,submission.language,submission.status,submission.timestamp],
        function(error){
            if(error) console.error(error);
            else console.log(`submitted with id ${this.lastID}`);
        }
    );
}
//calls the function which adds the provided problem in db
app.post('/add-problem', (req, res) => {
    const problem = req.body;
    addProblem(problem);
    res.send(`Problem_id: ${problem.problem_id} added successfully`);
});
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
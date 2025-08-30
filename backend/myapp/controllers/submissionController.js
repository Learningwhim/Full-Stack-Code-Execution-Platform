const addSubmission = require('../services/submissionService');

// this will put up a req in db to fetch status of provided submission
const createSubmission = async (req,res) => {
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
}

//calls the function ehich adds submission in db for processing

    
const getSubmissionStatus = async (req,res) => {
    try {
    const newSubmission = await addSubmission(req.body);
    res.json({submission_id: newSubmission[0].submission_id});
    }
    catch(error){
        res.status(500).json({ error: 'Server error while creating submission'});;
    }
}

module.exports = { createSubmission, getSubmissionStatus}


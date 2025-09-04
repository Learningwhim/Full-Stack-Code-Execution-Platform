const {addSubmission, getSubmissionStatusService} = require('../services/submissionService');

// this will put up a req in db to fetch status of provided submission
const getSubmissionStatus = async (req,res) => {
   try {
    const id = req.params.submission_id;

    const submission = await getSubmissionStatusService(id);

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: "Unable to fetch from db" });
  }
}

//calls the function ehich adds submission in db for processing

    
const createSubmission = async (req,res) => {
    try {
    const user_id = req.user.user_id;
    const problem = req.body;
    const submission = {user_id, ...problem};
    const newSubmission = await addSubmission(submission);
    
    res.json({submission_id: newSubmission[0].submission_id});
    }
    catch(error){
        res.status(500).json({ error: 'Server error while creating submission'});;
    }
}

module.exports = { createSubmission, getSubmissionStatus}


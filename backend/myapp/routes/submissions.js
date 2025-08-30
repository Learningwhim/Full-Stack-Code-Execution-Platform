const express = require('express');
const { createSubmission,getSubmissionStatus} = require('../controllers/submissionController');
const router = express.Router();
router.post('/submit', createSubmission);
router.post('/status/:submission_id', getSubmissionStatus);

module.exports = router;